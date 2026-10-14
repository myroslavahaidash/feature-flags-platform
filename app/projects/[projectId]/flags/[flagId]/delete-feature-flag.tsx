"use client";

import { startTransition, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { deleteFeatureFlagAction } from "@/app/projects/[projectId]/flags/[flagId]/actions";

type DeleteFeatureFlagProps = {
  projectId: string;
  featureFlagId: string;
  featureFlagName: string;
};

type DeleteFeatureFlagState = {
  error: string | null;
};

export function DeleteFeatureFlag({
  projectId,
  featureFlagId,
  featureFlagName,
}: DeleteFeatureFlagProps) {
  const [state, deleteFlag, isPending] = useActionState(
    async (): Promise<DeleteFeatureFlagState> =>
      deleteFeatureFlagAction(featureFlagId, projectId),
    { error: null },
  );

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${featureFlagName}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    startTransition(deleteFlag);
  }

  return (
    <section>
      <h2 className="text-lg text-red-700">Danger zone</h2>

      <p className="mt-1 mb-4 text-sm text-zinc-600">
        Permanently delete this feature flag and all of its environment values.
      </p>

      {state.error && <p role="alert">{state.error}</p>}

      {isPending && (
        <p role="status">Deleting &#34;{featureFlagName}&#34;...</p>
      )}

      <Button
        variant="danger"
        disabled={isPending}
        type="button"
        onClick={handleDelete}
      >
        Delete flag
      </Button>
    </section>
  );
}
