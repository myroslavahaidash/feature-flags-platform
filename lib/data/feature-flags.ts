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

type FeatureFlagWithValues = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  values: {
    environmentId: string;
    environmentKey: string;
    environmentName: string;
    value: boolean;
  }[];
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
      existingFlag.values.push(environmentValue);
    } else {
      featureFlagsById.set(row.id, {
        id: row.id,
        key: row.key,
        name: row.name,
        description: row.description,
        values: [environmentValue],
      });
    }
  }

  return [...featureFlagsById.values()];
};
