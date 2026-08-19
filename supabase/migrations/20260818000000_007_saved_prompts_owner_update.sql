-- Allow authenticated users to edit only their own saved prompts.
-- No schema change and no public access is introduced.

DROP POLICY IF EXISTS "Users can update own prompts" ON public.saved_prompts;

CREATE POLICY "Users can update own prompts"
  ON public.saved_prompts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
