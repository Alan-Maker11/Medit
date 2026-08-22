-- Dynamic stair-climber pricing by floor instead of a flat fee.
-- Run this in the Supabase SQL Editor.

ALTER TABLE trips ADD COLUMN IF NOT EXISTS stair_climber_floor INT NOT NULL DEFAULT 0;
