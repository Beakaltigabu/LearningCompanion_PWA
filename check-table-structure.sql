-- Check current table structure
\d "Mascots"

-- Or use this query to see all columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Mascots';