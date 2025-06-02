-- Add religious preference columns to parent_intake_form table
ALTER TABLE parent_intake_form
ADD COLUMN religious_affiliation VARCHAR(50),
ADD COLUMN religious_importance VARCHAR(20);

-- Add check constraints to ensure valid values
ALTER TABLE parent_intake_form
ADD CONSTRAINT check_religious_affiliation 
CHECK (religious_affiliation IN ('secular', 'christian', 'catholic', 'jewish', 'islamic', 'other', 'no preference')),
ADD CONSTRAINT check_religious_importance
CHECK (religious_importance IN ('required', 'preferred', 'neutral', 'avoid')); 