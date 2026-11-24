CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.current_store_role(_store_id uuid)
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

CREATE OR REPLACE FUNCTION private.has_store_role(_store_id uuid, _roles text[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private
AS $$
  SELECT COALESCE(private.current_store_role(_store_id) = ANY(_roles), false);
$$;

CREATE OR REPLACE FUNCTION private.is_store_member(_store_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, private
AS $$
  SELECT private.current_store_role(_store_id) IS NOT NULL;
$$;

REVOKE ALL ON FUNCTION private.current_store_role(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.has_store_role(uuid, text[]) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.is_store_member(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.current_store_role(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.has_store_role(uuid, text[]) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_store_member(uuid) TO authenticated, service_role;

-- Update agent update guard trigger function to use private.current_store_role
CREATE OR REPLACE FUNCTION public.enforce_agent_order_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND private.current_store_role(OLD.store_id) = 'agent' THEN
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

-- Re-point all RLS policies from public.* helpers to private.* helpers
ALTER POLICY order_items_member_select ON public.order_items
  USING (private.is_store_member(store_id));
ALTER POLICY order_items_manager_insert ON public.order_items
  WITH CHECK (private.has_store_role(store_id, ARRAY['owner', 'manager']));
ALTER POLICY order_items_manager_update ON public.order_items
  USING (private.has_store_role(store_id, ARRAY['owner', 'manager']))
  WITH CHECK (private.has_store_role(store_id, ARRAY['owner', 'manager']));
ALTER POLICY order_items_manager_delete ON public.order_items
  USING (private.has_store_role(store_id, ARRAY['owner', 'manager']));

ALTER POLICY order_events_member_select ON public.order_events
  USING (private.is_store_member(store_id));
ALTER POLICY order_events_staff_insert ON public.order_events
  WITH CHECK (private.has_store_role(store_id, ARRAY['owner', 'manager', 'agent']));
ALTER POLICY order_events_manager_update ON public.order_events
  USING (private.has_store_role(store_id, ARRAY['owner', 'manager']))
  WITH CHECK (private.has_store_role(store_id, ARRAY['owner', 'manager']));
ALTER POLICY order_events_manager_delete ON public.order_events
  USING (private.has_store_role(store_id, ARRAY['owner', 'manager']));

ALTER POLICY stock_movements_member_select ON public.stock_movements
  USING (private.is_store_member(store_id));
ALTER POLICY stock_movements_stock_insert ON public.stock_movements
  WITH CHECK (private.has_store_role(store_id, ARRAY['owner', 'manager', 'stock_keeper']));
ALTER POLICY stock_movements_stock_update ON public.stock_movements
  USING (private.has_store_role(store_id, ARRAY['owner', 'manager', 'stock_keeper']))
  WITH CHECK (private.has_store_role(store_id, ARRAY['owner', 'manager', 'stock_keeper']));
ALTER POLICY stock_movements_stock_delete ON public.stock_movements
  USING (private.has_store_role(store_id, ARRAY['owner', 'manager', 'stock_keeper']));

ALTER POLICY shipments_member_select ON public.shipments
  USING (private.is_store_member(store_id));
ALTER POLICY shipments_manager_insert ON public.shipments
  WITH CHECK (private.has_store_role(store_id, ARRAY['owner', 'manager']));
ALTER POLICY shipments_manager_update ON public.shipments
  USING (private.has_store_role(store_id, ARRAY['owner', 'manager']))
  WITH CHECK (private.has_store_role(store_id, ARRAY['owner', 'manager']));
ALTER POLICY shipments_manager_delete ON public.shipments
  USING (private.has_store_role(store_id, ARRAY['owner', 'manager']));

ALTER POLICY ad_spend_member_select ON public.ad_spend
  USING (private.is_store_member(store_id));
ALTER POLICY ad_spend_manager_insert ON public.ad_spend
  WITH CHECK (private.has_store_role(store_id, ARRAY['owner', 'manager']));
ALTER POLICY ad_spend_manager_update ON public.ad_spend
  USING (private.has_store_role(store_id, ARRAY['owner', 'manager']))
  WITH CHECK (private.has_store_role(store_id, ARRAY['owner', 'manager']));
ALTER POLICY ad_spend_manager_delete ON public.ad_spend
  USING (private.has_store_role(store_id, ARRAY['owner', 'manager']));

ALTER POLICY expenses_member_select ON public.expenses
  USING (private.is_store_member(store_id));
ALTER POLICY expenses_manager_insert ON public.expenses
  WITH CHECK (private.has_store_role(store_id, ARRAY['owner', 'manager']));
ALTER POLICY expenses_manager_update ON public.expenses
  USING (private.has_store_role(store_id, ARRAY['owner', 'manager']))
  WITH CHECK (private.has_store_role(store_id, ARRAY['owner', 'manager']));
ALTER POLICY expenses_manager_delete ON public.expenses
  USING (private.has_store_role(store_id, ARRAY['owner', 'manager']));

ALTER POLICY blacklist_member_select ON public.blacklist
  USING (private.is_store_member(store_id));
ALTER POLICY blacklist_manager_insert ON public.blacklist
  WITH CHECK (private.has_store_role(store_id, ARRAY['owner', 'manager']));
ALTER POLICY blacklist_manager_update ON public.blacklist
  USING (private.has_store_role(store_id, ARRAY['owner', 'manager']))
  WITH CHECK (private.has_store_role(store_id, ARRAY['owner', 'manager']));
ALTER POLICY blacklist_manager_delete ON public.blacklist
  USING (private.has_store_role(store_id, ARRAY['owner', 'manager']));

ALTER POLICY team_invites_member_select ON public.team_invites
  USING (private.is_store_member(store_id));
ALTER POLICY team_invites_manager_insert ON public.team_invites
  WITH CHECK (
    private.has_store_role(store_id, ARRAY['owner', 'manager'])
    AND (role <> 'owner' OR private.has_store_role(store_id, ARRAY['owner']))
  );
ALTER POLICY team_invites_manager_update ON public.team_invites
  USING (
    private.has_store_role(store_id, ARRAY['owner', 'manager'])
    AND (role <> 'owner' OR private.has_store_role(store_id, ARRAY['owner']))
  )
  WITH CHECK (
    private.has_store_role(store_id, ARRAY['owner', 'manager'])
    AND (role <> 'owner' OR private.has_store_role(store_id, ARRAY['owner']))
  );
ALTER POLICY team_invites_manager_delete ON public.team_invites
  USING (
    private.has_store_role(store_id, ARRAY['owner', 'manager'])
    AND (role <> 'owner' OR private.has_store_role(store_id, ARRAY['owner']))
  );

ALTER POLICY stores_member_select ON public.stores
  USING (private.is_store_member(id));
ALTER POLICY stores_manager_update ON public.stores
  USING (private.has_store_role(id, ARRAY['owner', 'manager']))
  WITH CHECK (private.has_store_role(id, ARRAY['owner', 'manager']));

ALTER POLICY sdc_member_select ON public.store_delivery_companies
  USING (private.is_store_member(store_id));
ALTER POLICY sdc_manager_insert ON public.store_delivery_companies
  WITH CHECK (private.has_store_role(store_id, ARRAY['owner', 'manager']));
ALTER POLICY sdc_manager_update ON public.store_delivery_companies
  USING (private.has_store_role(store_id, ARRAY['owner', 'manager']))
  WITH CHECK (private.has_store_role(store_id, ARRAY['owner', 'manager']));
ALTER POLICY sdc_manager_delete ON public.store_delivery_companies
  USING (private.has_store_role(store_id, ARRAY['owner', 'manager']));

ALTER POLICY user_roles_member_select ON public.user_roles
  USING (user_id = (SELECT auth.uid()) OR private.is_store_member(store_id));
ALTER POLICY user_roles_manager_insert ON public.user_roles
  WITH CHECK (
    private.has_store_role(store_id, ARRAY['owner', 'manager'])
    AND role <> 'owner'
  );
ALTER POLICY user_roles_manager_update ON public.user_roles
  USING (
    private.has_store_role(store_id, ARRAY['owner', 'manager'])
    AND role <> 'owner'
  )
  WITH CHECK (
    private.has_store_role(store_id, ARRAY['owner', 'manager'])
    AND role <> 'owner'
  );
ALTER POLICY user_roles_manager_delete ON public.user_roles
  USING (
    private.has_store_role(store_id, ARRAY['owner', 'manager'])
    AND role <> 'owner'
  );

ALTER POLICY products_auth_read ON public.products
  USING (store_id IS NULL OR private.is_store_member(store_id));
ALTER POLICY products_owner_insert ON public.products
  WITH CHECK (private.has_store_role(store_id, ARRAY['owner', 'manager', 'stock_keeper']));
ALTER POLICY products_owner_update ON public.products
  USING (private.has_store_role(store_id, ARRAY['owner', 'manager', 'stock_keeper']))
  WITH CHECK (private.has_store_role(store_id, ARRAY['owner', 'manager', 'stock_keeper']));
ALTER POLICY products_owner_delete ON public.products
  USING (private.has_store_role(store_id, ARRAY['owner', 'manager', 'stock_keeper']));

ALTER POLICY orders_auth_read ON public.orders
  USING (store_id IS NULL OR private.is_store_member(store_id));
ALTER POLICY orders_owner_insert ON public.orders
  WITH CHECK (private.has_store_role(store_id, ARRAY['owner', 'manager']));
ALTER POLICY orders_owner_update ON public.orders
  USING (private.has_store_role(store_id, ARRAY['owner', 'manager', 'agent']))
  WITH CHECK (private.has_store_role(store_id, ARRAY['owner', 'manager', 'agent']));
ALTER POLICY orders_owner_delete ON public.orders
  USING (private.has_store_role(store_id, ARRAY['owner', 'manager']));

-- Drop the public copies so PostgREST no longer exposes them
DROP FUNCTION IF EXISTS public.is_store_member(uuid);
DROP FUNCTION IF EXISTS public.has_store_role(uuid, text[]);
DROP FUNCTION IF EXISTS public.current_store_role(uuid);
