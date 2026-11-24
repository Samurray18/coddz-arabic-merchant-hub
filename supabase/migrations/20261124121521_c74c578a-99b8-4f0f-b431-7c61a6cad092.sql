-- ============================================================
-- 1. Role helpers & user_roles role constraint
-- ============================================================
ALTER TABLE public.user_roles
  DROP CONSTRAINT IF EXISTS user_roles_role_check;

ALTER TABLE public.user_roles
  ADD CONSTRAINT user_roles_role_check
  CHECK (role IN ('owner', 'manager', 'agent', 'stock_keeper'));

CREATE OR REPLACE FUNCTION public.current_store_role(_store_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN _store_id IS NULL OR auth.uid() IS NULL THEN NULL
    WHEN EXISTS (
      SELECT 1
      FROM public.stores s
      WHERE s.id = _store_id AND s.owner_id = auth.uid()
    ) THEN 'owner'
    ELSE (
      SELECT ur.role
      FROM public.user_roles ur
      WHERE ur.store_id = _store_id AND ur.user_id = auth.uid()
      LIMIT 1
    )
  END;
$$;

CREATE OR REPLACE FUNCTION public.has_store_role(_store_id uuid, _roles text[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(public.current_store_role(_store_id) = ANY(_roles), false);
$$;

CREATE OR REPLACE FUNCTION public.is_store_member(_store_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.current_store_role(_store_id) IS NOT NULL;
$$;

REVOKE ALL ON FUNCTION public.current_store_role(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.has_store_role(uuid, text[]) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_store_member(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_store_role(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_store_role(uuid, text[]) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_store_member(uuid) TO authenticated, service_role;

-- ============================================================
-- 2. Extend products & backfill from payload
-- ============================================================
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS sku text,
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS price numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cost numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS stock integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS low_stock_threshold integer NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;

UPDATE public.products
SET
  name = COALESCE(NULLIF(payload->>'name', ''), name),
  sku = COALESCE(NULLIF(payload->>'sku', ''), sku),
  category = COALESCE(NULLIF(payload->>'category', ''), category),
  price = CASE
    WHEN (payload->>'price') ~ '^-?\d+(\.\d+)?$' THEN (payload->>'price')::numeric(12,2)
    ELSE price
  END,
  cost = CASE
    WHEN (payload->>'cost') ~ '^-?\d+(\.\d+)?$' THEN (payload->>'cost')::numeric(12,2)
    ELSE cost
  END,
  stock = CASE
    WHEN (payload->>'stock') ~ '^-?\d+$' THEN (payload->>'stock')::integer
    ELSE stock
  END
WHERE payload IS NOT NULL AND payload <> '{}'::jsonb;

-- ============================================================
-- 3. Extend orders, backfill from payload & auto-generate number
-- ============================================================
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS number text,
  ADD COLUMN IF NOT EXISTS customer_name text,
  ADD COLUMN IF NOT EXISTS wilaya text,
  ADD COLUMN IF NOT EXISTS commune text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS delivery_type text NOT NULL DEFAULT 'home',
  ADD COLUMN IF NOT EXISTS delivery_price numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS carrier text,
  ADD COLUMN IF NOT EXISTS tracking_number text,
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS confirmation_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_delivery_type_check,
  DROP CONSTRAINT IF EXISTS orders_confirmation_status_check;

ALTER TABLE public.orders
  ADD CONSTRAINT orders_delivery_type_check
    CHECK (delivery_type IN ('home', 'desk')),
  ADD CONSTRAINT orders_confirmation_status_check
    CHECK (confirmation_status IN ('pending', 'answered', 'no_answer', 'postponed', 'refused'));

UPDATE public.orders
SET
  number = COALESCE(NULLIF(number, ''), NULLIF(payload->>'number', '')),
  customer_name = COALESCE(NULLIF(customer_name, ''), NULLIF(payload->>'customer_name', ''), NULLIF(payload->>'name', '')),
  phone = COALESCE(NULLIF(phone, ''), NULLIF(payload->>'phone', '')),
  wilaya = COALESCE(NULLIF(wilaya, ''), NULLIF(payload->>'wilaya', '')),
  commune = COALESCE(NULLIF(commune, ''), NULLIF(payload->>'commune', '')),
  address = COALESCE(NULLIF(address, ''), NULLIF(payload->>'address', '')),
  delivery_type = CASE
    WHEN (payload->>'delivery_type') IN ('home', 'desk') THEN payload->>'delivery_type'
    ELSE delivery_type
  END,
  delivery_price = CASE
    WHEN (payload->>'delivery_price') ~ '^-?\d+(\.\d+)?$' THEN (payload->>'delivery_price')::numeric(12,2)
    ELSE delivery_price
  END,
  total = CASE
    WHEN (payload->>'total') ~ '^-?\d+(\.\d+)?$' THEN (payload->>'total')::numeric(12,2)
    WHEN (payload->>'amount') ~ '^-?\d+(\.\d+)?$' THEN (payload->>'amount')::numeric(12,2)
    ELSE total
  END,
  carrier = COALESCE(NULLIF(carrier, ''), NULLIF(payload->>'carrier', '')),
  tracking_number = COALESCE(NULLIF(tracking_number, ''), NULLIF(payload->>'tracking_number', '')),
  notes = COALESCE(NULLIF(notes, ''), NULLIF(payload->>'notes', '')),
  confirmation_status = CASE
    WHEN (payload->>'confirmation_status') IN ('pending', 'answered', 'no_answer', 'postponed', 'refused') THEN payload->>'confirmation_status'
    WHEN status IN ('confirmed', 'shipped', 'delivered', 'returned') THEN 'answered'
    ELSE confirmation_status
  END
WHERE payload IS NOT NULL AND payload <> '{}'::jsonb;

-- Backfill any remaining rows with NULL/blank number
WITH numbered AS (
  SELECT
    id,
    'DZ-' || (1000 + row_number() OVER (PARTITION BY store_id ORDER BY created_at, id))::text AS gen_number
  FROM public.orders
  WHERE number IS NULL OR btrim(number) = ''
)
UPDATE public.orders o
SET number = n.gen_number
FROM numbered n
WHERE o.id = n.id;

CREATE UNIQUE INDEX IF NOT EXISTS orders_store_number_unique
  ON public.orders (store_id, number)
  WHERE store_id IS NOT NULL AND number IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_orders_assigned_to ON public.orders (assigned_to);
CREATE INDEX IF NOT EXISTS idx_orders_store_created_at ON public.orders (store_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_store_status ON public.orders (store_id, status);

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num bigint;
  payload_num text;
BEGIN
  IF NEW.number IS NOT NULL AND btrim(NEW.number) <> '' THEN
    RETURN NEW;
  END IF;

  payload_num := NULLIF(btrim(COALESCE(NEW.payload->>'number', '')), '');

  IF NEW.store_id IS NOT NULL THEN
    PERFORM pg_advisory_xact_lock(hashtext('coddz_order_number_' || NEW.store_id::text));

    IF payload_num IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.store_id = NEW.store_id AND o.number = payload_num
    ) THEN
      NEW.number := payload_num;
      RETURN NEW;
    END IF;

    SELECT COALESCE(MAX(
      CASE
        WHEN o.number ~ '^DZ-[0-9]+$' THEN substring(o.number FROM 4)::bigint
        ELSE 1000
      END
    ), 1000) + 1
    INTO next_num
    FROM public.orders o
    WHERE o.store_id = NEW.store_id;

    NEW.number := 'DZ-' || next_num::text;
  ELSE
    IF payload_num IS NOT NULL THEN
      NEW.number := payload_num;
    ELSE
      SELECT COALESCE(MAX(
        CASE
          WHEN o.number ~ '^DZ-[0-9]+$' THEN substring(o.number FROM 4)::bigint
          ELSE 1000
        END
      ), 1000) + 1
      INTO next_num
      FROM public.orders o
      WHERE o.store_id IS NULL;

      NEW.number := 'DZ-' || next_num::text;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.generate_order_number() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS orders_generate_number ON public.orders;
CREATE TRIGGER orders_generate_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_order_number();

CREATE OR REPLACE FUNCTION public.enforce_agent_order_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND public.current_store_role(OLD.store_id) = 'agent' THEN
    IF NEW.store_id IS DISTINCT FROM OLD.store_id
      OR NEW.number IS DISTINCT FROM OLD.number
      OR NEW.customer_name IS DISTINCT FROM OLD.customer_name
      OR NEW.phone IS DISTINCT FROM OLD.phone
      OR NEW.wilaya IS DISTINCT FROM OLD.wilaya
      OR NEW.commune IS DISTINCT FROM OLD.commune
      OR NEW.address IS DISTINCT FROM OLD.address
      OR NEW.delivery_type IS DISTINCT FROM OLD.delivery_type
      OR NEW.delivery_price IS DISTINCT FROM OLD.delivery_price
      OR NEW.total IS DISTINCT FROM OLD.total
      OR NEW.carrier IS DISTINCT FROM OLD.carrier
      OR NEW.tracking_number IS DISTINCT FROM OLD.tracking_number
      OR NEW.assigned_to IS DISTINCT FROM OLD.assigned_to
      OR NEW.source IS DISTINCT FROM OLD.source
      OR NEW.external_order_id IS DISTINCT FROM OLD.external_order_id
      OR NEW.flags IS DISTINCT FROM OLD.flags
    THEN
      RAISE EXCEPTION 'Agents can only update order confirmation status, status, and notes'
        USING ERRCODE = '42501';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_agent_order_update() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS orders_enforce_agent_update ON public.orders;
CREATE TRIGGER orders_enforce_agent_update
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_agent_order_update();

-- ============================================================
-- 4. order_items
-- ============================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  name text NOT NULL DEFAULT '',
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price numeric(12,2) NOT NULL DEFAULT 0,
  cost numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS order_items_member_select ON public.order_items;
DROP POLICY IF EXISTS order_items_manager_insert ON public.order_items;
DROP POLICY IF EXISTS order_items_manager_update ON public.order_items;
DROP POLICY IF EXISTS order_items_manager_delete ON public.order_items;

CREATE POLICY order_items_member_select ON public.order_items
  FOR SELECT TO authenticated
  USING (public.is_store_member(store_id));

CREATE POLICY order_items_manager_insert ON public.order_items
  FOR INSERT TO authenticated
  WITH CHECK (public.has_store_role(store_id, ARRAY['owner', 'manager']));

CREATE POLICY order_items_manager_update ON public.order_items
  FOR UPDATE TO authenticated
  USING (public.has_store_role(store_id, ARRAY['owner', 'manager']))
  WITH CHECK (public.has_store_role(store_id, ARRAY['owner', 'manager']));

CREATE POLICY order_items_manager_delete ON public.order_items
  FOR DELETE TO authenticated
  USING (public.has_store_role(store_id, ARRAY['owner', 'manager']));

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_store_id ON public.order_items (store_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items (product_id);

-- ============================================================
-- 5. order_events
-- ============================================================
CREATE TABLE IF NOT EXISTS public.order_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'status_change',
  from_status text,
  to_status text,
  note text,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_events TO authenticated;
GRANT ALL ON public.order_events TO service_role;

ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS order_events_member_select ON public.order_events;
DROP POLICY IF EXISTS order_events_staff_insert ON public.order_events;
DROP POLICY IF EXISTS order_events_manager_update ON public.order_events;
DROP POLICY IF EXISTS order_events_manager_delete ON public.order_events;

CREATE POLICY order_events_member_select ON public.order_events
  FOR SELECT TO authenticated
  USING (public.is_store_member(store_id));

CREATE POLICY order_events_staff_insert ON public.order_events
  FOR INSERT TO authenticated
  WITH CHECK (public.has_store_role(store_id, ARRAY['owner', 'manager', 'agent']));

CREATE POLICY order_events_manager_update ON public.order_events
  FOR UPDATE TO authenticated
  USING (public.has_store_role(store_id, ARRAY['owner', 'manager']))
  WITH CHECK (public.has_store_role(store_id, ARRAY['owner', 'manager']));

CREATE POLICY order_events_manager_delete ON public.order_events
  FOR DELETE TO authenticated
  USING (public.has_store_role(store_id, ARRAY['owner', 'manager']));

CREATE INDEX IF NOT EXISTS idx_order_events_order_id ON public.order_events (order_id);
CREATE INDEX IF NOT EXISTS idx_order_events_store_id ON public.order_events (store_id);
CREATE INDEX IF NOT EXISTS idx_order_events_user_id ON public.order_events (user_id);

-- ============================================================
-- 6. stock_movements + automatic shipped/returned stock triggers
-- ============================================================
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  change integer NOT NULL,
  reason text NOT NULL DEFAULT 'manual',
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.stock_movements TO authenticated;
GRANT ALL ON public.stock_movements TO service_role;

ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS stock_movements_member_select ON public.stock_movements;
DROP POLICY IF EXISTS stock_movements_stock_insert ON public.stock_movements;
DROP POLICY IF EXISTS stock_movements_stock_update ON public.stock_movements;
DROP POLICY IF EXISTS stock_movements_stock_delete ON public.stock_movements;

CREATE POLICY stock_movements_member_select ON public.stock_movements
  FOR SELECT TO authenticated
  USING (public.is_store_member(store_id));

CREATE POLICY stock_movements_stock_insert ON public.stock_movements
  FOR INSERT TO authenticated
  WITH CHECK (public.has_store_role(store_id, ARRAY['owner', 'manager', 'stock_keeper']));

CREATE POLICY stock_movements_stock_update ON public.stock_movements
  FOR UPDATE TO authenticated
  USING (public.has_store_role(store_id, ARRAY['owner', 'manager', 'stock_keeper']))
  WITH CHECK (public.has_store_role(store_id, ARRAY['owner', 'manager', 'stock_keeper']));

CREATE POLICY stock_movements_stock_delete ON public.stock_movements
  FOR DELETE TO authenticated
  USING (public.has_store_role(store_id, ARRAY['owner', 'manager', 'stock_keeper']));

CREATE INDEX IF NOT EXISTS idx_stock_movements_store_id ON public.stock_movements (store_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON public.stock_movements (product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_order_id ON public.stock_movements (order_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_by ON public.stock_movements (created_by);

CREATE OR REPLACE FUNCTION public.sync_order_stock_on_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  delta_sign integer;
  movement_reason text;
  actor_id uuid;
  item record;
BEGIN
  IF NEW.store_id IS NULL OR NEW.status IS NOT DISTINCT FROM OLD.status THEN
    RETURN NEW;
  END IF;

  IF NEW.status = 'shipped' THEN
    delta_sign := -1;
    movement_reason := 'order_shipped';
  ELSIF NEW.status = 'returned' THEN
    delta_sign := 1;
    movement_reason := 'order_returned';
  ELSE
    RETURN NEW;
  END IF;

  SELECT p.id INTO actor_id
  FROM public.profiles p
  WHERE p.id = auth.uid();

  FOR item IN
    SELECT oi.product_id, oi.quantity
    FROM public.order_items oi
    WHERE oi.order_id = NEW.id
      AND oi.store_id = NEW.store_id
      AND oi.product_id IS NOT NULL
  LOOP
    UPDATE public.products
    SET
      stock = stock + (delta_sign * item.quantity),
      payload = jsonb_set(
        COALESCE(payload, '{}'::jsonb),
        '{stock}',
        to_jsonb(stock + (delta_sign * item.quantity)),
        true
      )
    WHERE id = item.product_id
      AND store_id = NEW.store_id;

    INSERT INTO public.stock_movements (
      store_id,
      product_id,
      change,
      reason,
      order_id,
      created_by
    ) VALUES (
      NEW.store_id,
      item.product_id,
      delta_sign * item.quantity,
      movement_reason,
      NEW.id,
      actor_id
    );
  END LOOP;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_order_stock_on_status_change() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS orders_stock_on_status_change ON public.orders;
CREATE TRIGGER orders_stock_on_status_change
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_order_stock_on_status_change();

-- ============================================================
-- 7. shipments
-- ============================================================
CREATE TABLE IF NOT EXISTS public.shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  carrier text NOT NULL DEFAULT '',
  tracking_number text,
  status text NOT NULL DEFAULT 'pending',
  cod_amount numeric(12,2) NOT NULL DEFAULT 0,
  collected boolean NOT NULL DEFAULT false,
  collected_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.shipments TO authenticated;
GRANT ALL ON public.shipments TO service_role;

ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS shipments_member_select ON public.shipments;
DROP POLICY IF EXISTS shipments_manager_insert ON public.shipments;
DROP POLICY IF EXISTS shipments_manager_update ON public.shipments;
DROP POLICY IF EXISTS shipments_manager_delete ON public.shipments;

CREATE POLICY shipments_member_select ON public.shipments
  FOR SELECT TO authenticated
  USING (public.is_store_member(store_id));

CREATE POLICY shipments_manager_insert ON public.shipments
  FOR INSERT TO authenticated
  WITH CHECK (public.has_store_role(store_id, ARRAY['owner', 'manager']));

CREATE POLICY shipments_manager_update ON public.shipments
  FOR UPDATE TO authenticated
  USING (public.has_store_role(store_id, ARRAY['owner', 'manager']))
  WITH CHECK (public.has_store_role(store_id, ARRAY['owner', 'manager']));

CREATE POLICY shipments_manager_delete ON public.shipments
  FOR DELETE TO authenticated
  USING (public.has_store_role(store_id, ARRAY['owner', 'manager']));

CREATE INDEX IF NOT EXISTS idx_shipments_store_id ON public.shipments (store_id);
CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON public.shipments (order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON public.shipments (tracking_number);

DROP TRIGGER IF EXISTS shipments_updated ON public.shipments;
CREATE TRIGGER shipments_updated
  BEFORE UPDATE ON public.shipments
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

-- ============================================================
-- 8. ad_spend & expenses
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ad_spend (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  platform text NOT NULL,
  amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (amount >= 0),
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ad_spend TO authenticated;
GRANT ALL ON public.ad_spend TO service_role;

ALTER TABLE public.ad_spend ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ad_spend_member_select ON public.ad_spend;
DROP POLICY IF EXISTS ad_spend_manager_insert ON public.ad_spend;
DROP POLICY IF EXISTS ad_spend_manager_update ON public.ad_spend;
DROP POLICY IF EXISTS ad_spend_manager_delete ON public.ad_spend;

CREATE POLICY ad_spend_member_select ON public.ad_spend
  FOR SELECT TO authenticated
  USING (public.is_store_member(store_id));

CREATE POLICY ad_spend_manager_insert ON public.ad_spend
  FOR INSERT TO authenticated
  WITH CHECK (public.has_store_role(store_id, ARRAY['owner', 'manager']));

CREATE POLICY ad_spend_manager_update ON public.ad_spend
  FOR UPDATE TO authenticated
  USING (public.has_store_role(store_id, ARRAY['owner', 'manager']))
  WITH CHECK (public.has_store_role(store_id, ARRAY['owner', 'manager']));

CREATE POLICY ad_spend_manager_delete ON public.ad_spend
  FOR DELETE TO authenticated
  USING (public.has_store_role(store_id, ARRAY['owner', 'manager']));

CREATE INDEX IF NOT EXISTS idx_ad_spend_store_date ON public.ad_spend (store_id, date DESC);

DROP TRIGGER IF EXISTS ad_spend_updated ON public.ad_spend;
CREATE TRIGGER ad_spend_updated
  BEFORE UPDATE ON public.ad_spend
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE IF NOT EXISTS public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  category text NOT NULL,
  amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (amount >= 0),
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO authenticated;
GRANT ALL ON public.expenses TO service_role;

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS expenses_member_select ON public.expenses;
DROP POLICY IF EXISTS expenses_manager_insert ON public.expenses;
DROP POLICY IF EXISTS expenses_manager_update ON public.expenses;
DROP POLICY IF EXISTS expenses_manager_delete ON public.expenses;

CREATE POLICY expenses_member_select ON public.expenses
  FOR SELECT TO authenticated
  USING (public.is_store_member(store_id));

CREATE POLICY expenses_manager_insert ON public.expenses
  FOR INSERT TO authenticated
  WITH CHECK (public.has_store_role(store_id, ARRAY['owner', 'manager']));

CREATE POLICY expenses_manager_update ON public.expenses
  FOR UPDATE TO authenticated
  USING (public.has_store_role(store_id, ARRAY['owner', 'manager']))
  WITH CHECK (public.has_store_role(store_id, ARRAY['owner', 'manager']));

CREATE POLICY expenses_manager_delete ON public.expenses
  FOR DELETE TO authenticated
  USING (public.has_store_role(store_id, ARRAY['owner', 'manager']));

CREATE INDEX IF NOT EXISTS idx_expenses_store_date ON public.expenses (store_id, date DESC);

DROP TRIGGER IF EXISTS expenses_updated ON public.expenses;
CREATE TRIGGER expenses_updated
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

-- ============================================================
-- 9. blacklist
-- ============================================================
CREATE TABLE IF NOT EXISTS public.blacklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  phone text NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (store_id, phone)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.blacklist TO authenticated;
GRANT ALL ON public.blacklist TO service_role;

ALTER TABLE public.blacklist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS blacklist_member_select ON public.blacklist;
DROP POLICY IF EXISTS blacklist_manager_insert ON public.blacklist;
DROP POLICY IF EXISTS blacklist_manager_update ON public.blacklist;
DROP POLICY IF EXISTS blacklist_manager_delete ON public.blacklist;

CREATE POLICY blacklist_member_select ON public.blacklist
  FOR SELECT TO authenticated
  USING (public.is_store_member(store_id));

CREATE POLICY blacklist_manager_insert ON public.blacklist
  FOR INSERT TO authenticated
  WITH CHECK (public.has_store_role(store_id, ARRAY['owner', 'manager']));

CREATE POLICY blacklist_manager_update ON public.blacklist
  FOR UPDATE TO authenticated
  USING (public.has_store_role(store_id, ARRAY['owner', 'manager']))
  WITH CHECK (public.has_store_role(store_id, ARRAY['owner', 'manager']));

CREATE POLICY blacklist_manager_delete ON public.blacklist
  FOR DELETE TO authenticated
  USING (public.has_store_role(store_id, ARRAY['owner', 'manager']));

-- ============================================================
-- 10. team_invites & role-aware RLS on existing store tables
-- ============================================================
CREATE TABLE IF NOT EXISTS public.team_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'agent' CHECK (role IN ('owner', 'manager', 'agent', 'stock_keeper')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_invites TO authenticated;
GRANT ALL ON public.team_invites TO service_role;

ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS team_invites_member_select ON public.team_invites;
DROP POLICY IF EXISTS team_invites_manager_insert ON public.team_invites;
DROP POLICY IF EXISTS team_invites_manager_update ON public.team_invites;
DROP POLICY IF EXISTS team_invites_manager_delete ON public.team_invites;

CREATE POLICY team_invites_member_select ON public.team_invites
  FOR SELECT TO authenticated
  USING (public.is_store_member(store_id));

CREATE POLICY team_invites_manager_insert ON public.team_invites
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_store_role(store_id, ARRAY['owner', 'manager'])
    AND (role <> 'owner' OR public.has_store_role(store_id, ARRAY['owner']))
  );

CREATE POLICY team_invites_manager_update ON public.team_invites
  FOR UPDATE TO authenticated
  USING (
    public.has_store_role(store_id, ARRAY['owner', 'manager'])
    AND (role <> 'owner' OR public.has_store_role(store_id, ARRAY['owner']))
  )
  WITH CHECK (
    public.has_store_role(store_id, ARRAY['owner', 'manager'])
    AND (role <> 'owner' OR public.has_store_role(store_id, ARRAY['owner']))
  );

CREATE POLICY team_invites_manager_delete ON public.team_invites
  FOR DELETE TO authenticated
  USING (
    public.has_store_role(store_id, ARRAY['owner', 'manager'])
    AND (role <> 'owner' OR public.has_store_role(store_id, ARRAY['owner']))
  );

CREATE INDEX IF NOT EXISTS idx_team_invites_store_id ON public.team_invites (store_id);
CREATE UNIQUE INDEX IF NOT EXISTS team_invites_store_email_pending_unique
  ON public.team_invites (store_id, lower(email))
  WHERE status = 'pending';

DROP TRIGGER IF EXISTS team_invites_updated ON public.team_invites;
CREATE TRIGGER team_invites_updated
  BEFORE UPDATE ON public.team_invites
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

-- Update RLS on stores
DROP POLICY IF EXISTS store_own ON public.stores;
DROP POLICY IF EXISTS stores_member_select ON public.stores;
DROP POLICY IF EXISTS stores_manager_update ON public.stores;

CREATE POLICY stores_member_select ON public.stores
  FOR SELECT TO authenticated
  USING (public.is_store_member(id));

CREATE POLICY stores_manager_update ON public.stores
  FOR UPDATE TO authenticated
  USING (public.has_store_role(id, ARRAY['owner', 'manager']))
  WITH CHECK (public.has_store_role(id, ARRAY['owner', 'manager']));

-- Update RLS on store_delivery_companies
DROP POLICY IF EXISTS sdc_owner ON public.store_delivery_companies;
DROP POLICY IF EXISTS sdc_member_select ON public.store_delivery_companies;
DROP POLICY IF EXISTS sdc_manager_insert ON public.store_delivery_companies;
DROP POLICY IF EXISTS sdc_manager_update ON public.store_delivery_companies;
DROP POLICY IF EXISTS sdc_manager_delete ON public.store_delivery_companies;

CREATE POLICY sdc_member_select ON public.store_delivery_companies
  FOR SELECT TO authenticated
  USING (public.is_store_member(store_id));

CREATE POLICY sdc_manager_insert ON public.store_delivery_companies
  FOR INSERT TO authenticated
  WITH CHECK (public.has_store_role(store_id, ARRAY['owner', 'manager']));

CREATE POLICY sdc_manager_update ON public.store_delivery_companies
  FOR UPDATE TO authenticated
  USING (public.has_store_role(store_id, ARRAY['owner', 'manager']))
  WITH CHECK (public.has_store_role(store_id, ARRAY['owner', 'manager']));

CREATE POLICY sdc_manager_delete ON public.store_delivery_companies
  FOR DELETE TO authenticated
  USING (public.has_store_role(store_id, ARRAY['owner', 'manager']));

-- Update RLS and grants on user_roles
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

DROP POLICY IF EXISTS roles_own ON public.user_roles;
DROP POLICY IF EXISTS user_roles_member_select ON public.user_roles;
DROP POLICY IF EXISTS user_roles_manager_insert ON public.user_roles;
DROP POLICY IF EXISTS user_roles_manager_update ON public.user_roles;
DROP POLICY IF EXISTS user_roles_manager_delete ON public.user_roles;

CREATE POLICY user_roles_member_select ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR public.is_store_member(store_id));

CREATE POLICY user_roles_manager_insert ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_store_role(store_id, ARRAY['owner', 'manager'])
    AND role <> 'owner'
  );

CREATE POLICY user_roles_manager_update ON public.user_roles
  FOR UPDATE TO authenticated
  USING (
    public.has_store_role(store_id, ARRAY['owner', 'manager'])
    AND role <> 'owner'
  )
  WITH CHECK (
    public.has_store_role(store_id, ARRAY['owner', 'manager'])
    AND role <> 'owner'
  );

CREATE POLICY user_roles_manager_delete ON public.user_roles
  FOR DELETE TO authenticated
  USING (
    public.has_store_role(store_id, ARRAY['owner', 'manager'])
    AND role <> 'owner'
  );

-- Update RLS on products (owner, manager, stock_keeper manage; any store member reads; anon reads demo)
DROP POLICY IF EXISTS products_auth_read ON public.products;
DROP POLICY IF EXISTS products_owner_insert ON public.products;
DROP POLICY IF EXISTS products_owner_update ON public.products;
DROP POLICY IF EXISTS products_owner_delete ON public.products;

CREATE POLICY products_auth_read ON public.products
  FOR SELECT TO authenticated
  USING (store_id IS NULL OR public.is_store_member(store_id));

CREATE POLICY products_owner_insert ON public.products
  FOR INSERT TO authenticated
  WITH CHECK (public.has_store_role(store_id, ARRAY['owner', 'manager', 'stock_keeper']));

CREATE POLICY products_owner_update ON public.products
  FOR UPDATE TO authenticated
  USING (public.has_store_role(store_id, ARRAY['owner', 'manager', 'stock_keeper']))
  WITH CHECK (public.has_store_role(store_id, ARRAY['owner', 'manager', 'stock_keeper']));

CREATE POLICY products_owner_delete ON public.products
  FOR DELETE TO authenticated
  USING (public.has_store_role(store_id, ARRAY['owner', 'manager', 'stock_keeper']));

-- Update RLS on orders (owner, manager manage; agent reads & updates confirmation/status; any member reads; anon reads demo)
DROP POLICY IF EXISTS orders_auth_read ON public.orders;
DROP POLICY IF EXISTS orders_owner_insert ON public.orders;
DROP POLICY IF EXISTS orders_owner_update ON public.orders;
DROP POLICY IF EXISTS orders_owner_delete ON public.orders;

CREATE POLICY orders_auth_read ON public.orders
  FOR SELECT TO authenticated
  USING (store_id IS NULL OR public.is_store_member(store_id));

CREATE POLICY orders_owner_insert ON public.orders
  FOR INSERT TO authenticated
  WITH CHECK (public.has_store_role(store_id, ARRAY['owner', 'manager']));

CREATE POLICY orders_owner_update ON public.orders
  FOR UPDATE TO authenticated
  USING (public.has_store_role(store_id, ARRAY['owner', 'manager', 'agent']))
  WITH CHECK (public.has_store_role(store_id, ARRAY['owner', 'manager', 'agent']));

CREATE POLICY orders_owner_delete ON public.orders
  FOR DELETE TO authenticated
  USING (public.has_store_role(store_id, ARRAY['owner', 'manager']));

-- ============================================================
-- 11. Realtime (REPLICA IDENTITY FULL + supabase_realtime)
-- ============================================================
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.order_events REPLICA IDENTITY FULL;
ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER TABLE public.shipments REPLICA IDENTITY FULL;
ALTER TABLE public.stock_movements REPLICA IDENTITY FULL;

DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['orders', 'order_events', 'products', 'shipments', 'stock_movements'] LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = tbl
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', tbl);
    END IF;
  END LOOP;
END $$;

-- ============================================================
-- 12. Dashboard stats function per store and date range
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_dashboard_stats(
  _store_id uuid,
  _from date DEFAULT NULL,
  _to date DEFAULT NULL
)
RETURNS TABLE (
  total_orders bigint,
  orders_by_status jsonb,
  revenue numeric,
  product_costs numeric,
  delivery_costs numeric,
  ad_spend numeric,
  expenses numeric,
  net_profit numeric
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  WITH filtered_orders AS (
    SELECT o.id, o.status, o.total, o.delivery_price
    FROM public.orders o
    WHERE o.store_id = _store_id
      AND (_from IS NULL OR o.created_at::date >= _from)
      AND (_to IS NULL OR o.created_at::date <= _to)
  ),
  status_counts AS (
    SELECT
      jsonb_build_object(
        'new', 0,
        'confirmed', 0,
        'shipped', 0,
        'delivered', 0,
        'returned', 0,
        'canceled', 0
      ) || COALESCE(
        (
          SELECT jsonb_object_agg(s.status, s.cnt)
          FROM (
            SELECT fo.status, count(*)::bigint AS cnt
            FROM filtered_orders fo
            GROUP BY fo.status
          ) s
        ),
        '{}'::jsonb
      ) AS by_status
  ),
  order_totals AS (
    SELECT
      count(*)::bigint AS total_orders,
      COALESCE(SUM(fo.total) FILTER (WHERE fo.status = 'delivered'), 0)::numeric AS revenue,
      COALESCE(SUM(fo.delivery_price) FILTER (WHERE fo.status IN ('delivered', 'returned')), 0)::numeric AS delivery_costs
    FROM filtered_orders fo
  ),
  item_costs AS (
    SELECT
      COALESCE(SUM(oi.cost * oi.quantity), 0)::numeric AS product_costs
    FROM public.order_items oi
    INNER JOIN filtered_orders fo ON fo.id = oi.order_id
    WHERE oi.store_id = _store_id
      AND fo.status = 'delivered'
  ),
  ads AS (
    SELECT COALESCE(SUM(a.amount), 0)::numeric AS ad_spend
    FROM public.ad_spend a
    WHERE a.store_id = _store_id
      AND (_from IS NULL OR a.date >= _from)
      AND (_to IS NULL OR a.date <= _to)
  ),
  exp AS (
    SELECT COALESCE(SUM(e.amount), 0)::numeric AS expenses
    FROM public.expenses e
    WHERE e.store_id = _store_id
      AND (_from IS NULL OR e.date >= _from)
      AND (_to IS NULL OR e.date <= _to)
  )
  SELECT
    ot.total_orders,
    sc.by_status AS orders_by_status,
    ot.revenue,
    ic.product_costs,
    ot.delivery_costs,
    a.ad_spend,
    ex.expenses,
    (ot.revenue - ic.product_costs - ot.delivery_costs - a.ad_spend - ex.expenses)::numeric AS net_profit
  FROM order_totals ot
  CROSS JOIN status_counts sc
  CROSS JOIN item_costs ic
  CROSS JOIN ads a
  CROSS JOIN exp ex;
$$;

REVOKE ALL ON FUNCTION public.get_dashboard_stats(uuid, date, date) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats(uuid, date, date) TO authenticated, service_role;
