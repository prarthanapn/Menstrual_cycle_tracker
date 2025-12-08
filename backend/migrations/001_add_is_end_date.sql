-- Migration: add is_end_date column to cycle_records if not exists
ALTER TABLE cycle_records
ADD COLUMN IF NOT EXISTS is_end_date TINYINT(1) DEFAULT 0;

-- Optionally, if you want to set is_end_date=1 for rows that already have end_date set:
-- UPDATE cycle_records SET is_end_date = 1 WHERE end_date IS NOT NULL;
