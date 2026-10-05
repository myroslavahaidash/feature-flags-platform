import { getProjects } from "@/lib/data/projects";
import Link from "next/link";

export default async function Projects() {
  const projects = await getProjects();

  return (
    <div className="max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Projects
        </h1>

        <p className="mt-2 text-zinc-600">
          Select a project to manage its feature flags and environment values.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <li key={project.id}>
            <Link
              href={`/projects/${project.id}`}
              className="group block rounded-lg border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-semibold text-zinc-900 group-hover:underline">
                  {project.name}
                </h2>

                <span
                  aria-hidden="true"
                  className="text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-zinc-700"
                >
                  →
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Manage feature flags across project environments.
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
