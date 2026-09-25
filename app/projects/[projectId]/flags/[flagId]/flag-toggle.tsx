"use client";

import { updateFeatureFlagValueAction } from "@/app/projects/[projectId]/actions";
import { type ChangeEvent, startTransition, useActionState } from "react";

type FlagToggleProps = {
  checked: boolean;
  featureFlagId: string;
  environmentId: string;
  environmentName: string;
  projectId: string;
};

type FlagToggleState = {
  checked: boolean;
  error: string | null;
};

export function FlagToggle({
  checked,
  featureFlagId,
  environmentId,
  environmentName,
  projectId,
}: FlagToggleProps) {
  const [state, updateValue, isPending] = useActionState(
    async (
      previousState: FlagToggleState,
      nextValue: boolean,
    ): Promise<FlagToggleState> => {
      try {
        const result = await updateFeatureFlagValueAction(
          nextValue,
          featureFlagId,
          environmentId,
          projectId,
        );

        if (result.error) {
          return {
            ...previousState,
            error: result.error,
          };
        }

        return {
          checked: nextValue,
          error: null,
        };
      } catch {
        return {
          ...previousState,
          error: "Could not update the feature flag value",
        };
      }
    },
    { checked, error: null },
  );

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.currentTarget.checked;

    startTransition(() => {
      updateValue(nextValue);
    });
  }

  return (
    <div className="flex items-center gap-2">
      {isPending && (
        <span role="status" className="text-xs text-zinc-500">
          Saving...
        </span>
      )}

      {state.error && (
        <span role="alert" className="max-w-56 text-right text-xs text-red-700">
          {state.error}
        </span>
      )}

      <input
        type="checkbox"
        checked={state.checked}
        onChange={handleChange}
        disabled={isPending}
        aria-label={`${environmentName} feature flag value`}
        aria-busy={isPending}
        className="h-5 w-5 cursor-pointer rounded border-zinc-300 accent-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}
