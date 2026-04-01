-- Fix RLS policies: replace self-referencing org_members subqueries
-- with a SECURITY DEFINER function to avoid empty results

CREATE OR REPLACE FUNCTION public.get_user_org_ids()
RETURNS SETOF uuid AS $$
  SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- org_members
DROP POLICY IF EXISTS "Org members can view members" ON org_members;
CREATE POLICY "Org members can view members" ON org_members FOR SELECT
  USING (user_id = auth.uid() OR org_id IN (SELECT public.get_user_org_ids()));

-- organizations
DROP POLICY IF EXISTS "Members can view own org" ON organizations;
CREATE POLICY "Members can view own org" ON organizations FOR SELECT
  USING (id IN (SELECT public.get_user_org_ids()));

DROP POLICY IF EXISTS "Owners can update org" ON organizations;
CREATE POLICY "Owners can update org" ON organizations FOR UPDATE
  USING (id IN (SELECT public.get_user_org_ids()));

-- clients
DROP POLICY IF EXISTS "Org members can view clients" ON clients;
CREATE POLICY "Org members can view clients" ON clients FOR SELECT
  USING (org_id IN (SELECT public.get_user_org_ids()));

DROP POLICY IF EXISTS "Org members can insert clients" ON clients;
CREATE POLICY "Org members can insert clients" ON clients FOR INSERT
  WITH CHECK (org_id IN (SELECT public.get_user_org_ids()));

DROP POLICY IF EXISTS "Org members can update clients" ON clients;
CREATE POLICY "Org members can update clients" ON clients FOR UPDATE
  USING (org_id IN (SELECT public.get_user_org_ids()));

DROP POLICY IF EXISTS "Org members can delete clients" ON clients;
CREATE POLICY "Org members can delete clients" ON clients FOR DELETE
  USING (org_id IN (SELECT public.get_user_org_ids()));

-- inquiries
DROP POLICY IF EXISTS "Org members can view inquiries" ON inquiries;
CREATE POLICY "Org members can view inquiries" ON inquiries FOR SELECT
  USING (org_id IN (SELECT public.get_user_org_ids()));

DROP POLICY IF EXISTS "Org members can insert inquiries" ON inquiries;
CREATE POLICY "Org members can insert inquiries" ON inquiries FOR INSERT
  WITH CHECK (org_id IN (SELECT public.get_user_org_ids()));

DROP POLICY IF EXISTS "Org members can update inquiries" ON inquiries;
CREATE POLICY "Org members can update inquiries" ON inquiries FOR UPDATE
  USING (org_id IN (SELECT public.get_user_org_ids()));

-- bookings
DROP POLICY IF EXISTS "Org members can view bookings" ON bookings;
CREATE POLICY "Org members can view bookings" ON bookings FOR SELECT
  USING (org_id IN (SELECT public.get_user_org_ids()));

DROP POLICY IF EXISTS "Org members can insert bookings" ON bookings;
CREATE POLICY "Org members can insert bookings" ON bookings FOR INSERT
  WITH CHECK (org_id IN (SELECT public.get_user_org_ids()));

DROP POLICY IF EXISTS "Org members can update bookings" ON bookings;
CREATE POLICY "Org members can update bookings" ON bookings FOR UPDATE
  USING (org_id IN (SELECT public.get_user_org_ids()));

-- contracts
DROP POLICY IF EXISTS "Org members can view contracts" ON contracts;
CREATE POLICY "Org members can view contracts" ON contracts FOR SELECT
  USING (org_id IN (SELECT public.get_user_org_ids()));

DROP POLICY IF EXISTS "Org members can insert contracts" ON contracts;
CREATE POLICY "Org members can insert contracts" ON contracts FOR INSERT
  WITH CHECK (org_id IN (SELECT public.get_user_org_ids()));

DROP POLICY IF EXISTS "Org members can update contracts" ON contracts;
CREATE POLICY "Org members can update contracts" ON contracts FOR UPDATE
  USING (org_id IN (SELECT public.get_user_org_ids()));

-- contract_templates
DROP POLICY IF EXISTS "Org members can view contract_templates" ON contract_templates;
CREATE POLICY "Org members can view contract_templates" ON contract_templates FOR SELECT
  USING (org_id IN (SELECT public.get_user_org_ids()));

-- intake_forms
DROP POLICY IF EXISTS "Org members can view intake_forms" ON intake_forms;
CREATE POLICY "Org members can view intake_forms" ON intake_forms FOR SELECT
  USING (org_id IN (SELECT public.get_user_org_ids()));

DROP POLICY IF EXISTS "Org members can insert intake_forms" ON intake_forms;
CREATE POLICY "Org members can insert intake_forms" ON intake_forms FOR INSERT
  WITH CHECK (org_id IN (SELECT public.get_user_org_ids()));

DROP POLICY IF EXISTS "Org members can update intake_forms" ON intake_forms;
CREATE POLICY "Org members can update intake_forms" ON intake_forms FOR UPDATE
  USING (org_id IN (SELECT public.get_user_org_ids()));

DROP POLICY IF EXISTS "Org members can delete intake_forms" ON intake_forms;
CREATE POLICY "Org members can delete intake_forms" ON intake_forms FOR DELETE
  USING (org_id IN (SELECT public.get_user_org_ids()));

-- workflow_logs
DROP POLICY IF EXISTS "Org members can view workflow_logs" ON workflow_logs;
CREATE POLICY "Org members can view workflow_logs" ON workflow_logs FOR SELECT
  USING (org_id IN (SELECT public.get_user_org_ids()));

DROP POLICY IF EXISTS "Org members can insert workflow_logs" ON workflow_logs;
CREATE POLICY "Org members can insert workflow_logs" ON workflow_logs FOR INSERT
  WITH CHECK (org_id IN (SELECT public.get_user_org_ids()));

-- crew_members
DROP POLICY IF EXISTS "Org members can view crew" ON crew_members;
CREATE POLICY "Org members can view crew" ON crew_members FOR SELECT
  USING (org_id IN (SELECT public.get_user_org_ids()) OR user_id = auth.uid());

DROP POLICY IF EXISTS "Org admins can insert crew" ON crew_members;
CREATE POLICY "Org admins can insert crew" ON crew_members FOR INSERT
  WITH CHECK (org_id IN (SELECT public.get_user_org_ids()));

DROP POLICY IF EXISTS "Org admins can update crew" ON crew_members;
CREATE POLICY "Org admins can update crew" ON crew_members FOR UPDATE
  USING (org_id IN (SELECT public.get_user_org_ids()));

DROP POLICY IF EXISTS "Org admins can delete crew" ON crew_members;
CREATE POLICY "Org admins can delete crew" ON crew_members FOR DELETE
  USING (org_id IN (SELECT public.get_user_org_ids()));
