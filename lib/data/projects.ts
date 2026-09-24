import { db } from "@/lib/db";

type ProjectRow = {
  id: string;
  name: string;
};

export async function getProjects() {
  const result = await db.query<ProjectRow>(
    `
    SELECT id, name
    FROM projects
    ORDER BY name
    `,
  );

  return result.rows;
}
