BEGIN;

ALTER TABLE feature_flag_configurations
DROP CONSTRAINT feature_flag_configurations_feature_flag_id_fkey;

ALTER TABLE feature_flag_configurations
ADD CONSTRAINT feature_flag_configurations_feature_flag_id_fkey
FOREIGN KEY (feature_flag_id)
REFERENCES feature_flags(id)
ON DELETE CASCADE;

COMMIT;