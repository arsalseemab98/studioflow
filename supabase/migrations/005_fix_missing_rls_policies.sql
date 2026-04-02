-- Fix intake_responses: add INSERT and UPDATE, fix SELECT to use get_user_org_ids
DROP POLICY IF EXISTS "Org members can view responses" ON intake_responses;
CREATE POLICY "Org members can view responses" ON intake_responses FOR SELECT
  USING (form_id IN (SELECT id FROM intake_forms WHERE org_id IN (SELECT public.get_user_org_ids())));
CREATE POLICY "Org members can insert responses" ON intake_responses FOR INSERT
  WITH CHECK (form_id IN (SELECT id FROM intake_forms WHERE org_id IN (SELECT public.get_user_org_ids())));
CREATE POLICY "Org members can update responses" ON intake_responses FOR UPDATE
  USING (form_id IN (SELECT id FROM intake_forms WHERE org_id IN (SELECT public.get_user_org_ids())));

-- Fix booking_assignments: update to use get_user_org_ids + freelancer access
DROP POLICY IF EXISTS "Org members can view assignments" ON booking_assignments;
DROP POLICY IF EXISTS "Org members can insert assignments" ON booking_assignments;
DROP POLICY IF EXISTS "Org members can delete assignments" ON booking_assignments;
DROP POLICY IF EXISTS "Freelancers can view own assignments" ON booking_assignments;

CREATE POLICY "Org members can view assignments" ON booking_assignments FOR SELECT
  USING (
    booking_id IN (SELECT id FROM bookings WHERE org_id IN (SELECT public.get_user_org_ids()))
    OR crew_member_id IN (SELECT id FROM crew_members WHERE user_id = auth.uid())
  );
CREATE POLICY "Org members can insert assignments" ON booking_assignments FOR INSERT
  WITH CHECK (booking_id IN (SELECT id FROM bookings WHERE org_id IN (SELECT public.get_user_org_ids())));
CREATE POLICY "Org members can delete assignments" ON booking_assignments FOR DELETE
  USING (booking_id IN (SELECT id FROM bookings WHERE org_id IN (SELECT public.get_user_org_ids())));

-- Fix contract_templates: update to use get_user_org_ids
DROP POLICY IF EXISTS "Org members can view contract_templates" ON contract_templates;
DROP POLICY IF EXISTS "Org members can insert contract_templates" ON contract_templates;
DROP POLICY IF EXISTS "Org members can update contract_templates" ON contract_templates;
DROP POLICY IF EXISTS "Org members can delete contract_templates" ON contract_templates;

CREATE POLICY "Org members can view contract_templates" ON contract_templates FOR SELECT
  USING (org_id IN (SELECT public.get_user_org_ids()));
CREATE POLICY "Org members can insert contract_templates" ON contract_templates FOR INSERT
  WITH CHECK (org_id IN (SELECT public.get_user_org_ids()));
CREATE POLICY "Org members can update contract_templates" ON contract_templates FOR UPDATE
  USING (org_id IN (SELECT public.get_user_org_ids()));
CREATE POLICY "Org members can delete contract_templates" ON contract_templates FOR DELETE
  USING (org_id IN (SELECT public.get_user_org_ids()));
