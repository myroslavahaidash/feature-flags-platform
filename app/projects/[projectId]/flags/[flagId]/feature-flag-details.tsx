"use client";

import { useState } from "react";
import type { FeatureFlagWithValues } from "@/lib/data/feature-flags";
import { Button } from "@/components/ui/button";
import { EditFeatureFlagForm } from "@/app/projects/[projectId]/flags/[flagId]/edit-feature-flag-form";

type FeatureFlagDetailsProps = {
  featureFlag: FeatureFlagWithValues;
  projectId: string;
};

export function FeatureFlagDetails({
  featureFlag,
  projectId,
}: FeatureFlagDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (!isEditing) {
    return (
      <div className="mt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              {featureFlag.name}
            </h1>

            <code className="mt-2 inline-block rounded bg-zinc-100 px-2 py-1 text-sm text-zinc-600">
              {featureFlag.key}
            </code>
          </div>

          <Button
            type="button"
            className="shrink-0 px-3 py-1.5 text-sm"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        </div>

        {featureFlag.description && (
          <p className="mt-4 leading-7 text-zinc-600">
            {featureFlag.description}
          </p>
        )}
      </div>
    );
  }

  return (
    <EditFeatureFlagForm
      featureFlag={featureFlag}
      projectId={projectId}
      onClose={() => setIsEditing(false)}
    />
  );
}
