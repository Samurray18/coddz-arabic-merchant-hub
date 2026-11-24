ALTER TABLE public.stores
  ADD COLUMN IF NOT EXISTS wilaya text;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.store_delivery_companies TO authenticated;
GRANT ALL ON public.store_delivery_companies TO service_role;
ALTER TABLE public.store_delivery_companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sdc_owner ON public.store_delivery_companies;
CREATE POLICY sdc_owner ON public.store_delivery_companies
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.stores s
      WHERE s.id = store_delivery_companies.store_id
        AND s.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.stores s
      WHERE s.id = store_delivery_companies.store_id
        AND s.owner_id = auth.uid()
    )
  );

CREATE OR REPLACE FUNCTION public.setup_merchant()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sid uuid;
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', ''));

  INSERT INTO public.stores (owner_id, name, wilaya)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'store_name', ''), 'متجري'),
    NULLIF(NEW.raw_user_meta_data->>'wilaya', '')
  )
  RETURNING id INTO sid;

  INSERT INTO public.user_roles (user_id, store_id, role)
  VALUES (NEW.id, sid, 'owner');

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.setup_merchant() FROM PUBLIC, anon, authenticated;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS external_order_id text,
  ADD COLUMN IF NOT EXISTS flags jsonb NOT NULL DEFAULT '{}'::jsonb;

UPDATE public.orders
SET
  status = COALESCE(NULLIF(payload->>'status', ''), 'new'),
  phone = NULLIF(payload->>'phone', '')
WHERE payload ? 'status' OR payload ? 'phone';

CREATE UNIQUE INDEX IF NOT EXISTS orders_store_source_external_order_unique
  ON public.orders (store_id, source, external_order_id)
  WHERE external_order_id IS NOT NULL;
