import { db } from "@/lib/db";

type CreateFeatureFlagRow = {
  id: string;
};

export async function createFeatureFlag(
  projectId: string,
  name: string,
  key: string,
  description?: string,
): Promise<string> {
  const result = await db.query<CreateFeatureFlagRow>(
    `
      WITH inserted_flag AS (
        INSERT INTO feature_flags (
          key,
          name,
          description,
          type,
          project_id
        )
        VALUES ($1, $2, $3, 'boolean', $4)
        RETURNING id
      ),
      inserted_configurations AS (
        INSERT INTO feature_flag_configurations (
          feature_flag_id,
          environment_id,
          value
        )
        SELECT
          inserted_flag.id,
          environments.id,
          FALSE
        FROM inserted_flag
        JOIN environments
          ON environments.project_id = $4
        RETURNING id
      )
      SELECT id
      FROM inserted_flag
    `,
    [key, name, description ?? null, projectId],
  );

  return result.rows[0].id;
}
