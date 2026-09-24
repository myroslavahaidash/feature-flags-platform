import {
  createFeatureFlagAction,
  type CreateFeatureFlagState,
} from "@/app/projects/[projectId]/actions";
import { startTransition, useActionState } from "react";
import { Button } from "@/components/ui/button";

type AddFeatureFlagFormProps = {
  projectId: string;
  onClose: () => void;
};

export function AddFeatureFlagForm({
  projectId,
  onClose,
}: AddFeatureFlagFormProps) {
  const initialState: CreateFeatureFlagState = {
    error: null,
    values: {
      name: "",
      key: "",
      description: "",
    },
  };

  const createFeatureFlagForProject = createFeatureFlagAction.bind(
    null,
    projectId,
  );

  const [state, formAction, isPending] = useActionState(
    async (previousState: CreateFeatureFlagState, formData: FormData) => {
      const nextState = await createFeatureFlagForProject(
        previousState,
        formData,
      );

      if (nextState.error === null) {
        startTransition(() => {
          onClose();
        });
      }

      return nextState;
    },
    initialState,
  );

  const inputClassName =
    "w-full rounded-md border border-zinc-300 px-2 py-1 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200";
  const labelClassName = "block mb-1";

  return (
    <form
      action={formAction}
      className="mb-6 border border-zinc-200 p-5 rounded-lg space-y-4"
    >
      <div>
        <label htmlFor="name" className={labelClassName}>
          Name
        </label>
        <input
          required
          id="name"
          name="name"
          type="text"
          className={inputClassName}
          defaultValue={state.values.name}
        />
      </div>

      <div>
        <label htmlFor="key" className={labelClassName}>
          Key
        </label>
        <input
          required
          id="key"
          name="key"
          type="text"
          className={inputClassName}
          defaultValue={state.values.key}
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClassName}>
          Description
        </label>
        <input
          id="description"
          name="description"
          type="text"
          className={inputClassName}
          defaultValue={state.values.description}
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="mt-5 flex justify-end gap-3">
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create flag"}
        </Button>
      </div>
    </form>
  );
}
