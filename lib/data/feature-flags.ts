import { db } from "@/lib/db";

type FeatureFlagRow = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  environmentId: string;
  environmentKey: string;
  environmentName: string;
  value: boolean;
};

type EnvironmentValue = {
  environmentId: string;
  environmentKey: string;
  environmentName: string;
  value: boolean;
};

export type FeatureFlagWithValues = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  environmentValues: EnvironmentValue[];
};

export const getFeatureFlagsByProjectId = async (projectId: string) => {
  const result = await db.query<FeatureFlagRow>(
    `
  SELECT
      ff.id,
      ff.key,
      ff.name,
      ff.description,
      e.id AS "environmentId",
      e.key AS "environmentKey",
      e.name AS "environmentName",
      ffc.value
  FROM feature_flags AS ff
  JOIN feature_flag_configurations AS ffc
  ON ffc.feature_flag_id = ff.id
  JOIN environments AS e
  ON e.id = ffc.environment_id
  AND e.project_id = ff.project_id
  WHERE ff.project_id = $1
  ORDER BY ff.name, e.display_order
  `,
    [projectId],
  );

  const featureFlagsById = new Map<string, FeatureFlagWithValues>();

  for (const row of result.rows) {
    const environmentValue = {
      environmentId: row.environmentId,
      environmentKey: row.environmentKey,
      environmentName: row.environmentName,
      value: row.value,
    };

    const existingFlag = featureFlagsById.get(row.id);

    if (existingFlag) {
      existingFlag.environmentValues.push(environmentValue);
    } else {
      featureFlagsById.set(row.id, {
        id: row.id,
        key: row.key,
        name: row.name,
        description: row.description,
        environmentValues: [environmentValue],
      });
    }
  }

  return [...featureFlagsById.values()];
};

export async function getFeatureFlagById(
  projectId: string,
  flagId: string,
): Promise<FeatureFlagWithValues | null> {
  const result = await db.query<FeatureFlagRow>(
    `
      SELECT
        ff.id,
        ff.key,
        ff.name,
        ff.description,
        e.id AS "environmentId",
        e.key AS "environmentKey",
        e.name AS "environmentName",
        ffc.value
      FROM feature_flags AS ff
      JOIN feature_flag_configurations AS ffc
        ON ffc.feature_flag_id = ff.id
      JOIN environments AS e
        ON e.id = ffc.environment_id
        AND e.project_id = ff.project_id
      WHERE ff.project_id = $1
        AND ff.id = $2
      ORDER BY e.display_order
    `,
    [projectId, flagId],
  );

  const firstRow = result.rows[0];

  if (!firstRow) {
    return null;
  }

  return {
    id: firstRow.id,
    key: firstRow.key,
    name: firstRow.name,
    description: firstRow.description,
    environmentValues: result.rows.map(
      ({ environmentId, environmentKey, environmentName, value }) => ({
        environmentId,
        environmentKey,
        environmentName,
        value,
      }),
    ),
  };
}

export async function updateFeatureFlagValue(
  value: boolean,
  featureFlagId: string,
  environmentId: string,
) {
  const result = await db.query(
    `
    UPDATE feature_flag_configurations
    SET value = $1
    WHERE feature_flag_id = $2
    AND environment_id = $3
    `,
    [value, featureFlagId, environmentId],
  );

  return result.rowCount === 1;
}

export async function deleteFeatureFlag(id: string) {
  const result = await db.query(
    `
    DELETE FROM feature_flags
    WHERE id = $1
    `,
    [id],
  );

  return result.rowCount === 1;
}
