import { getProjects } from "@/lib/data/projects";
import Link from "next/link";

export default async function Projects() {
  const projects = await getProjects();

  return (
    <>
      <h1>Projects</h1>

      {projects.map((project) => (
        <Link href={`/projects/${project.id}`} key={project.id}>
          {project.name}
        </Link>
      ))}
    </>
  );
}
