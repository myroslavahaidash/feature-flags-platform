import { getFeatureFlagsByProjectId } from "@/lib/data/feature-flags";
import { AddFeatureFlag } from "@/app/projects/[projectId]/add-feature-flag";

type ProjectPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function Project({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const featureFlags = await getFeatureFlagsByProjectId(projectId);

  const environments = featureFlags[0]?.values ?? [];

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl">Feature flags</h1>

      <AddFeatureFlag projectId={projectId} />

      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        <table className="w-full text-left">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-4 py-3" scope="col">
                Flag
              </th>

              {environments.map((env) => (
                <th key={env.environmentId} className="px-4 py-3" scope="col">
                  {env.environmentName}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-200">
            {featureFlags.map((flag) => (
              <tr key={flag.id}>
                <th className="px-4 py-3" scope="row">
                  <div>{flag.name}</div>
                  <code className="text-sm text-zinc-500">{flag.key}</code>
                </th>

                {flag.values.map((environment) => (
                  <td key={environment.environmentId} className="px-4 py-3">
                    {environment.value ? "Enabled" : "Disabled"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
