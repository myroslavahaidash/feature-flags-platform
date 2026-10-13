import { getFeatureFlagById } from "@/lib/data/feature-flags";
import { notFound } from "next/navigation";
import { FlagToggle } from "@/app/projects/[projectId]/flags/[flagId]/flag-toggle";
import Link from "next/link";
import { DeleteFeatureFlag } from "@/app/projects/[projectId]/flags/[flagId]/delete-feature-flag";
import { FeatureFlagDetails } from "@/app/projects/[projectId]/flags/[flagId]/feature-flag-details";

type FeatureFlagPageProps = {
  params: Promise<{
    projectId: string;
    flagId: string;
  }>;
};

export default async function FeatureFlagPage({
  params,
}: FeatureFlagPageProps) {
  const { projectId, flagId } = await params;

  if (!/^\d+$/.test(projectId) || !/^\d+$/.test(flagId)) {
    notFound();
  }

  const featureFlag = await getFeatureFlagById(projectId, flagId);

  if (!featureFlag) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <header className="mb-6">
        <Link
          href={`/projects/${projectId}`}
          className="text-sm text-zinc-600 hover:text-zinc-900 hover:underline"
        >
          ← Back to feature flags
        </Link>

        <FeatureFlagDetails featureFlag={featureFlag} projectId={projectId} />
      </header>

      <section>
        <div className="mb-4">
          <h2 className="text-2xl py-3">Environment values</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Configure whether this flag is enabled in each environment.
          </p>
        </div>

        <div className="mb-6 divide-y divide-zinc-200 border border-zinc-200 rounded-lg">
          {featureFlag.environmentValues.map((environment) => (
            <div
              key={environment.environmentId}
              className="flex justify-between px-3 py-3"
            >
              {environment.environmentName}

              <FlagToggle
                checked={environment.value}
                featureFlagId={featureFlag.id}
                environmentId={environment.environmentId}
                environmentName={environment.environmentName}
                projectId={projectId}
              />
            </div>
          ))}
        </div>
      </section>

      <DeleteFeatureFlag
        projectId={projectId}
        featureFlagId={featureFlag.id}
        featureFlagName={featureFlag.name}
      />
    </div>
  );
}
