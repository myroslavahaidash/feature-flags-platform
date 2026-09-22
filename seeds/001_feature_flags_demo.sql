BEGIN;

INSERT INTO projects (name)
VALUES ('Feature Flags Demo')
RETURNING id AS project_id
\gset

INSERT INTO environments (key, name, project_id, display_order)
VALUES
    ('development', 'Development', :project_id, 1),
    ('staging', 'Staging', :project_id, 2),
    ('production', 'Production', :project_id, 3);

INSERT INTO feature_flags (key, name, description, type, project_id)
VALUES
    (
        'dark-mode',
        'Dark Mode',
        'Controls availability of the dark theme.',
        'boolean',
        :project_id
    ),
    (
        'search',
        'Search',
        'Controls availability of the search functionality.',
        'boolean',
        :project_id
    ),
    (
        'new-navigation',
        'New Navigation',
        'Controls availability of the new navigation experience.',
        'boolean',
        :project_id
    ),
    (
        'compact-layout',
        'Compact Layout',
        'Controls availability of the compact layout.',
        'boolean',
        :project_id
    );

INSERT INTO feature_flag_configurations (
    feature_flag_id,
    environment_id,
    value
)
SELECT
    ff.id,
    e.id,
    CASE
        WHEN ff.key IN ('dark-mode', 'compact-layout')
            THEN e.key IN ('development', 'staging')
        WHEN ff.key = 'new-navigation'
            THEN e.key = 'development'
        WHEN ff.key = 'search'
            THEN TRUE
        ELSE FALSE
    END
FROM feature_flags AS ff
JOIN environments AS e
    ON e.project_id = ff.project_id
WHERE ff.project_id = :project_id;

COMMIT;
