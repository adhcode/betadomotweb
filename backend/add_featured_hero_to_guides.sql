-- Add featured_hero column to guides table
-- This allows guides to be featured in the hero section of the homepage

-- Add the column (defaults to false)
ALTER TABLE guides 
ADD COLUMN IF NOT EXISTS featured_hero BOOLEAN DEFAULT false;

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_guides_featured_hero ON guides(featured_hero) WHERE featured_hero = true;

-- Add a comment to document the column
COMMENT ON COLUMN guides.featured_hero IS 'Indicates if this guide should be displayed as the featured hero on the homepage';
