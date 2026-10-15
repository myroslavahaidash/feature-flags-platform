import { getFeatureFlagsByProjectId } from "@/lib/data/feature-flags";
import { AddFeatureFlag } from "@/app/projects/[projectId]/add-feature-flag";
import Link from "next/link";
import { notFound } from "next/navigation";
import { databaseIdSchema } from "@/lib/validation/feature-flags";
import { getEnvironmentsByProjectId } from "@/lib/data/environments";

type ProjectPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function Project({ params }: ProjectPageProps) {
  const { projectId } = await params;

  const result = databaseIdSchema.safeParse(projectId);

  if (!result.success) {
    notFound();
  }

  const validProjectId = result.data;

  const [featureFlags, environments] = await Promise.all([
    getFeatureFlagsByProjectId(validProjectId),
    getEnvironmentsByProjectId(validProjectId),
  ]);

  const hasFeatureFlags = featureFlags.length > 0;

  return (
    <>
      <Link
        href={`/projects`}
        className="text-sm text-zinc-600 hover:text-zinc-900 hover:underline"
      >
        ← Back to projects
      </Link>

      <h1 className="mb-6 mt-4 text-3xl">Feature flags</h1>

      <AddFeatureFlag projectId={validProjectId} />

      {hasFeatureFlags ? (
        <div className="overflow-x-auto rounded-lg border border-zinc-200">
          <table className="w-full text-left">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-4 py-3" scope="col">
                  Flag
                </th>

                {environments.map((environment) => (
                  <th key={environment.id} className="px-4 py-3" scope="col">
                    {environment.name}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200">
              {featureFlags.map((flag) => (
                <tr key={flag.id}>
                  <th className="px-4 py-3" scope="row">
                    <Link
                      className="block"
                      href={`/projects/${validProjectId}/flags/${flag.id}`}
                    >
                      {flag.name}
                    </Link>
                    <code className="text-sm text-zinc-500">{flag.key}</code>
                  </th>

                  {environments.map((environment) => {
                    const environmentValue = flag.environmentValues.find(
                      (value) => value.environmentId === environment.id,
                    );

                    return (
                      <td key={environment.id} className="px-4 py-3">
                        {environmentValue
                          ? environmentValue.value
                            ? "Enabled"
                            : "Disabled"
                          : "Not configured"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <section className="rounded-lg border border-dashed border-zinc-300 px-6 py-12 text-center">
          <h2 className="font-semibold text-zinc-900">No feature flags yet</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Create your first feature flag to configure it across environments.
          </p>
        </section>
      )}
    </>
  );
}
