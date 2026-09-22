BEGIN;

ALTER TABLE feature_flags
ALTER COLUMN description DROP NOT NULL;

ALTER TABLE feature_flags
ADD CONSTRAINT feature_flags_type_boolean
CHECK (type = 'boolean');

COMMIT;