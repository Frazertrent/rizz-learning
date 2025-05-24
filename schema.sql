-- This would be added to your Supabase schema

-- Platform links table to store resource links for time blocks
CREATE TABLE platform_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  term_plan_id UUID NOT NULL REFERENCES term_plans(id) ON DELETE CASCADE,
  time_block_id UUID NOT NULL REFERENCES time_blocks(id) ON DELETE CASCADE,
  resource_link TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(time_block_id)
);

-- Add RLS policies
ALTER TABLE platform_links ENABLE ROW LEVEL SECURITY;

-- Policy for selecting platform links
CREATE POLICY "Users can view their own platform links" 
ON platform_links FOR SELECT 
USING (
  term_plan_id IN (
    SELECT id FROM term_plans 
    WHERE student_id IN (
      SELECT id FROM students 
      WHERE parent_id = auth.uid()
    )
  )
);

-- Policy for inserting platform links
CREATE POLICY "Users can insert their own platform links" 
ON platform_links FOR INSERT 
WITH CHECK (
  term_plan_id IN (
    SELECT id FROM term_plans 
    WHERE student_id IN (
      SELECT id FROM students 
      WHERE parent_id = auth.uid()
    )
  )
);

-- Policy for updating platform links
CREATE POLICY "Users can update their own platform links" 
ON platform_links FOR UPDATE
USING (
  term_plan_id IN (
    SELECT id FROM term_plans 
    WHERE student_id IN (
      SELECT id FROM students 
      WHERE parent_id = auth.uid()
    )
  )
)
WITH CHECK (
  term_plan_id IN (
    SELECT id FROM term_plans 
    WHERE student_id IN (
      SELECT id FROM students 
      WHERE parent_id = auth.uid()
    )
  )
);

-- Policy for deleting platform links
CREATE POLICY "Users can delete their own platform links" 
ON platform_links FOR DELETE
USING (
  term_plan_id IN (
    SELECT id FROM term_plans 
    WHERE student_id IN (
      SELECT id FROM students 
      WHERE parent_id = auth.uid()
    )
  )
);

-- Add platform_urls and platform_help columns to student_term_plans table
ALTER TABLE student_term_plans 
ADD COLUMN platform_urls JSONB DEFAULT '{}'::jsonb,
ADD COLUMN platform_help JSONB DEFAULT '{}'::jsonb;
