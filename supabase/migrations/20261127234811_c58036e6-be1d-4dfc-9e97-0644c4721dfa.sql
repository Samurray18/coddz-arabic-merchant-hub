CREATE OR REPLACE FUNCTION private.store_owner_id(_store_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT s.owner_id
  FROM public.stores s
  WHERE s.id = _store_id
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION private.store_owner_id(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.store_owner_id(uuid) TO authenticated, service_role;

REVOKE UPDATE ON public.stores FROM authenticated;
GRANT UPDATE (
  name,
  wilaya,
  phone,
  business_type,
  sales_channels,
  monthly_orders,
  team_size,
  onboarding_step,
  onboarding_completed
) ON public.stores TO authenticated;

CREATE OR REPLACE FUNCTION public.prevent_store_owner_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'private'
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NEW.owner_id IS DISTINCT FROM OLD.owner_id THEN
    RAISE EXCEPTION 'Store ownership cannot be modified'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.prevent_store_owner_change() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.prevent_store_owner_change() TO authenticated, service_role;

DROP TRIGGER IF EXISTS stores_prevent_owner_change ON public.stores;
CREATE TRIGGER stores_prevent_owner_change
BEFORE UPDATE ON public.stores
FOR EACH ROW
EXECUTE FUNCTION public.prevent_store_owner_change();

DROP POLICY IF EXISTS "stores_manager_update" ON public.stores;
CREATE POLICY "stores_manager_update"
ON public.stores
FOR UPDATE
TO authenticated
USING (private.has_store_role(id, ARRAY['owner'::text, 'manager'::text]))
WITH CHECK (
  private.has_store_role(id, ARRAY['owner'::text, 'manager'::text])
  AND owner_id = private.store_owner_id(id)
);