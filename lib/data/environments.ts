import { db } from "@/lib/db";

export type Environment = {
  id: string;
  key: string;
  name: string;
};

export async function getEnvironmentsByProjectId(
  projectId: string,
): Promise<Environment[]> {
  const result = await db.query<Environment>(
    `
      SELECT id, key, name
      FROM environments
      WHERE project_id = $1
      ORDER BY display_order
    `,
    [projectId],
  );

  return result.rows;
}
