ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS wilaya text;

CREATE TABLE IF NOT EXISTS public.store_delivery_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  company text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (store_id, company)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.store_delivery_companies TO authenticated;
ALTER TABLE public.store_delivery_companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sdc_owner ON public.store_delivery_companies;
CREATE POLICY sdc_owner ON public.store_delivery_companies
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid()));
