DELETE FROM public.products WHERE store_id IS NULL;
DELETE FROM public.orders WHERE store_id IS NULL;

DROP POLICY IF EXISTS "products_anon_demo" ON public.products;
DROP POLICY IF EXISTS "orders_anon_demo" ON public.orders;

REVOKE ALL ON public.products FROM anon;
REVOKE ALL ON public.orders FROM anon;

DROP POLICY IF EXISTS "products_auth_read" ON public.products;
CREATE POLICY "products_auth_read"
  ON public.products
  FOR SELECT
  TO authenticated
  USING (private.is_store_member(store_id));

DROP POLICY IF EXISTS "orders_auth_read" ON public.orders;
CREATE POLICY "orders_auth_read"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (private.is_store_member(store_id));

ALTER TABLE public.products ALTER COLUMN store_id SET NOT NULL;
ALTER TABLE public.orders ALTER COLUMN store_id SET NOT NULL;