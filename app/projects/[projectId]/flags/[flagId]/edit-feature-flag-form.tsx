import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import {
  updateFeatureFlagDetailsAction,
  type UpdateFeatureFlagDetailsState,
} from "@/app/projects/[projectId]/actions";
import type { FeatureFlagWithValues } from "@/lib/data/feature-flags";

type EditFeatureFlagFormProps = {
  featureFlag: FeatureFlagWithValues;
  projectId: string;
  onClose: () => void;
};

export function EditFeatureFlagForm({
  projectId,
  featureFlag,
  onClose,
}: EditFeatureFlagFormProps) {
  const inputClassName =
    "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200";
  const labelClassName = "mb-1.5 block text-sm font-medium text-zinc-700";

  const updateDetails = updateFeatureFlagDetailsAction.bind(
    null,
    projectId,
    featureFlag.id,
  );

  const initialState: UpdateFeatureFlagDetailsState = {
    success: false,
    formError: null,
    fieldErrors: {},
  };

  const [state, formAction, isPending] = useActionState(
    async (
      previousState: UpdateFeatureFlagDetailsState,
      formData: FormData,
    ) => {
      const nextState = await updateDetails(previousState, formData);

      if (nextState.success) {
        onClose();
      }

      return nextState;
    },
    initialState,
  );

  const nameError = state.fieldErrors.name?.[0];
  const descriptionError = state.fieldErrors.description?.[0];

  return (
    <form
      action={formAction}
      className="mt-4 space-y-4 rounded-lg border border-zinc-200 bg-zinc-50/50 p-5"
    >
      <div>
        <label className={labelClassName} htmlFor="name">
          Name
        </label>
        <input
          className={inputClassName}
          id="name"
          name="name"
          defaultValue={featureFlag.name}
          required
          aria-invalid={Boolean(nameError)}
          aria-describedby={nameError ? "name-error" : undefined}
        />
        {nameError && (
          <p id="name-error" role="alert" className="mt-1 text-sm text-red-700">
            {nameError}
          </p>
        )}
      </div>

      <div>
        <span className={labelClassName}>Key</span>
        <code className="inline-block rounded bg-zinc-200/70 px-2 py-1 text-sm text-zinc-700">
          {featureFlag.key}
        </code>
      </div>

      <div>
        <label className={labelClassName} htmlFor="description">
          Description
        </label>
        <textarea
          className={`${inputClassName} min-h-24 resize-y`}
          id="description"
          name="description"
          defaultValue={featureFlag.description ?? ""}
          aria-invalid={Boolean(descriptionError)}
          aria-describedby={descriptionError ? "description-error" : undefined}
        />
        {descriptionError && (
          <p
            id="description-error"
            role="alert"
            className="mt-1 text-sm text-red-700"
          >
            {descriptionError}
          </p>
        )}
      </div>

      {state.formError && (
        <p role="alert" className="text-sm text-red-700">
          {state.formError}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-1">
        <Button type="button" disabled={isPending} onClick={onClose}>
          Cancel
        </Button>

        <Button variant="primary" type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
