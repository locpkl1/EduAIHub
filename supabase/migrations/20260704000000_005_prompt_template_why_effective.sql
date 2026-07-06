ALTER TABLE public.prompt_templates
ADD COLUMN IF NOT EXISTS why_effective text;
