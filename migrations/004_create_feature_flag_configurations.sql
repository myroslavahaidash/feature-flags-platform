CREATE TABLE feature_flag_configurations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    feature_flag_id BIGINT NOT NULL,
    environment_id BIGINT NOT NULL,
    value BOOLEAN NOT NULL,

    FOREIGN KEY (feature_flag_id) REFERENCES feature_flags(id),
    FOREIGN KEY (environment_id) REFERENCES environments(id),

    UNIQUE (feature_flag_id, environment_id)
);