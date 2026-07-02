/*
  # EduAI-Hub Admin Center database foundation

  Adds the admin role table and CMS content tables used by the Admin Center.

  Notes:
  - The first admin row must be inserted manually through Supabase SQL Editor
    or with the service role key because no admin exists before bootstrapping.
  - curriculum_items represents "Bản đồ chương trình học" metadata for better
    AI learning prompts. It is not full textbook PDF hosting.
*/

-- Shared updated_at trigger helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Admin role registry
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT admin_roles_role_check CHECK (role = 'admin')
);

ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- RLS-safe admin check. Security definer avoids recursive admin_roles policies.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- Admin-managed posts for guides, lessons, and learning articles
CREATE TABLE IF NOT EXISTS public.content_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text,
  category text,
  tags text[] NOT NULL DEFAULT '{}',
  reading_minutes integer NOT NULL DEFAULT 5,
  thumbnail_url text,
  status text NOT NULL DEFAULT 'draft',
  featured boolean NOT NULL DEFAULT false,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  CONSTRAINT content_posts_status_check CHECK (status IN ('draft', 'published', 'archived')),
  CONSTRAINT content_posts_reading_minutes_check CHECK (reading_minutes >= 1)
);

-- Public/admin-managed prompt samples. Private user prompts stay in saved_prompts.
CREATE TABLE IF NOT EXISTS public.prompt_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  prompt_content text NOT NULL,
  purpose text,
  subject text,
  grade integer,
  book_series text,
  difficulty text,
  usage_note text,
  tags text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft',
  featured boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT prompt_templates_status_check CHECK (status IN ('draft', 'published', 'archived')),
  CONSTRAINT prompt_templates_grade_check CHECK (grade IS NULL OR grade BETWEEN 10 AND 12),
  CONSTRAINT prompt_templates_difficulty_check CHECK (
    difficulty IS NULL OR difficulty IN ('basic', 'intermediate', 'advanced')
  )
);

-- Bản đồ chương trình học: grade/book/subject/chapter/lesson prompt metadata.
CREATE TABLE IF NOT EXISTS public.curriculum_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grade integer NOT NULL,
  book_series text NOT NULL,
  subject text NOT NULL,
  chapter_title text NOT NULL,
  lesson_title text,
  description text,
  suggested_prompt text,
  status text NOT NULL DEFAULT 'draft',
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT curriculum_items_grade_check CHECK (grade BETWEEN 10 AND 12),
  CONSTRAINT curriculum_items_status_check CHECK (status IN ('draft', 'published', 'archived'))
);

-- Learning resources such as self-made PDFs, worksheets, mindmaps, images, and links.
CREATE TABLE IF NOT EXISTS public.learning_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  resource_type text NOT NULL DEFAULT 'link',
  file_url text,
  external_url text,
  subject text,
  grade integer,
  book_series text,
  curriculum_item_id uuid REFERENCES public.curriculum_items(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft',
  featured boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT learning_resources_status_check CHECK (status IN ('draft', 'published', 'archived')),
  CONSTRAINT learning_resources_resource_type_check CHECK (
    resource_type IN ('link', 'pdf', 'image', 'document', 'other')
  ),
  CONSTRAINT learning_resources_grade_check CHECK (grade IS NULL OR grade BETWEEN 10 AND 12)
);

-- updated_at triggers
DROP TRIGGER IF EXISTS set_content_posts_updated_at ON public.content_posts;
CREATE TRIGGER set_content_posts_updated_at
  BEFORE UPDATE ON public.content_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_prompt_templates_updated_at ON public.prompt_templates;
CREATE TRIGGER set_prompt_templates_updated_at
  BEFORE UPDATE ON public.prompt_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_curriculum_items_updated_at ON public.curriculum_items;
CREATE TRIGGER set_curriculum_items_updated_at
  BEFORE UPDATE ON public.curriculum_items
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_learning_resources_updated_at ON public.learning_resources;
CREATE TRIGGER set_learning_resources_updated_at
  BEFORE UPDATE ON public.learning_resources
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON public.admin_roles(user_id);

CREATE INDEX IF NOT EXISTS idx_content_posts_status ON public.content_posts(status);
CREATE INDEX IF NOT EXISTS idx_content_posts_featured ON public.content_posts(featured);
CREATE INDEX IF NOT EXISTS idx_content_posts_created_at ON public.content_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_posts_slug ON public.content_posts(slug);

CREATE INDEX IF NOT EXISTS idx_prompt_templates_status ON public.prompt_templates(status);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_featured ON public.prompt_templates(featured);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_created_at ON public.prompt_templates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_grade ON public.prompt_templates(grade);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_subject ON public.prompt_templates(subject);

CREATE INDEX IF NOT EXISTS idx_curriculum_items_status ON public.curriculum_items(status);
CREATE INDEX IF NOT EXISTS idx_curriculum_items_created_at ON public.curriculum_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_curriculum_items_grade ON public.curriculum_items(grade);
CREATE INDEX IF NOT EXISTS idx_curriculum_items_subject ON public.curriculum_items(subject);

CREATE INDEX IF NOT EXISTS idx_learning_resources_status ON public.learning_resources(status);
CREATE INDEX IF NOT EXISTS idx_learning_resources_featured ON public.learning_resources(featured);
CREATE INDEX IF NOT EXISTS idx_learning_resources_created_at ON public.learning_resources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_learning_resources_grade ON public.learning_resources(grade);
CREATE INDEX IF NOT EXISTS idx_learning_resources_subject ON public.learning_resources(subject);
CREATE INDEX IF NOT EXISTS idx_learning_resources_curriculum_item_id
  ON public.learning_resources(curriculum_item_id);

-- RLS policies: admin_roles
DROP POLICY IF EXISTS "Users can view own admin role" ON public.admin_roles;
CREATE POLICY "Users can view own admin role"
  ON public.admin_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all admin roles" ON public.admin_roles;
CREATE POLICY "Admins can view all admin roles"
  ON public.admin_roles FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert admin roles" ON public.admin_roles;
CREATE POLICY "Admins can insert admin roles"
  ON public.admin_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin() AND role = 'admin');

DROP POLICY IF EXISTS "Admins can update admin roles" ON public.admin_roles;
CREATE POLICY "Admins can update admin roles"
  ON public.admin_roles FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin() AND role = 'admin');

DROP POLICY IF EXISTS "Admins can delete admin roles" ON public.admin_roles;
CREATE POLICY "Admins can delete admin roles"
  ON public.admin_roles FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- RLS policies: content_posts
ALTER TABLE public.content_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published content posts" ON public.content_posts;
CREATE POLICY "Anyone can view published content posts"
  ON public.content_posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS "Admins can view all content posts" ON public.content_posts;
CREATE POLICY "Admins can view all content posts"
  ON public.content_posts FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert content posts" ON public.content_posts;
CREATE POLICY "Admins can insert content posts"
  ON public.content_posts FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update content posts" ON public.content_posts;
CREATE POLICY "Admins can update content posts"
  ON public.content_posts FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete content posts" ON public.content_posts;
CREATE POLICY "Admins can delete content posts"
  ON public.content_posts FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- RLS policies: prompt_templates
ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published prompt templates" ON public.prompt_templates;
CREATE POLICY "Anyone can view published prompt templates"
  ON public.prompt_templates FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS "Admins can view all prompt templates" ON public.prompt_templates;
CREATE POLICY "Admins can view all prompt templates"
  ON public.prompt_templates FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert prompt templates" ON public.prompt_templates;
CREATE POLICY "Admins can insert prompt templates"
  ON public.prompt_templates FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update prompt templates" ON public.prompt_templates;
CREATE POLICY "Admins can update prompt templates"
  ON public.prompt_templates FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete prompt templates" ON public.prompt_templates;
CREATE POLICY "Admins can delete prompt templates"
  ON public.prompt_templates FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- RLS policies: curriculum_items
ALTER TABLE public.curriculum_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published curriculum items" ON public.curriculum_items;
CREATE POLICY "Anyone can view published curriculum items"
  ON public.curriculum_items FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS "Admins can view all curriculum items" ON public.curriculum_items;
CREATE POLICY "Admins can view all curriculum items"
  ON public.curriculum_items FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert curriculum items" ON public.curriculum_items;
CREATE POLICY "Admins can insert curriculum items"
  ON public.curriculum_items FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update curriculum items" ON public.curriculum_items;
CREATE POLICY "Admins can update curriculum items"
  ON public.curriculum_items FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete curriculum items" ON public.curriculum_items;
CREATE POLICY "Admins can delete curriculum items"
  ON public.curriculum_items FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- RLS policies: learning_resources
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published learning resources" ON public.learning_resources;
CREATE POLICY "Anyone can view published learning resources"
  ON public.learning_resources FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS "Admins can view all learning resources" ON public.learning_resources;
CREATE POLICY "Admins can view all learning resources"
  ON public.learning_resources FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert learning resources" ON public.learning_resources;
CREATE POLICY "Admins can insert learning resources"
  ON public.learning_resources FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update learning resources" ON public.learning_resources;
CREATE POLICY "Admins can update learning resources"
  ON public.learning_resources FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete learning resources" ON public.learning_resources;
CREATE POLICY "Admins can delete learning resources"
  ON public.learning_resources FOR DELETE
  TO authenticated
  USING (public.is_admin());
