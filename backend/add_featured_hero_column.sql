-- Add featured_hero column to posts table
-- This column indicates if a post should be displayed as the hero on the homepage

ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS featured_hero BOOLEAN DEFAULT FALSE;

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_posts_featured_hero ON posts(featured_hero) WHERE featured_hero = TRUE;

-- Add a comment to document the column
COMMENT ON COLUMN posts.featured_hero IS 'Indicates if this post is the featured hero on the homepage. Only one post should have this set to true at a time.';
