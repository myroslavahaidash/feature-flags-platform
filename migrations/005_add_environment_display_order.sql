BEGIN;

ALTER TABLE environments
ADD COLUMN display_order INTEGER;

UPDATE environments
SET display_order = CASE key
    WHEN 'development' THEN 1
    WHEN 'staging' THEN 2
    WHEN 'production' THEN 3
END
WHERE key IN ('development', 'staging', 'production');

ALTER TABLE environments
ALTER COLUMN display_order SET NOT NULL;

ALTER TABLE environments
ADD CONSTRAINT environments_display_order_positive
CHECK (display_order > 0);

ALTER TABLE environments
ADD CONSTRAINT environments_project_display_order_unique
UNIQUE (project_id, display_order);

COMMIT;