"use server";

import { createFeatureFlag } from "@/lib/data/create-feature-flag";
import { revalidatePath } from "next/cache";
import {
  createFeatureFlagSchema,
  databaseIdSchema,
} from "@/lib/validation/feature-flags";
import { z } from "zod";

export type CreateFeatureFlagState = {
  success: boolean;
  formError: string | null;
  fieldErrors: {
    name?: string[];
    key?: string[];
    description?: string[];
  };
  values: {
    name: string;
    key: string;
    description: string;
  };
};

export async function createFeatureFlagAction(
  projectId: string,
  _previousState: CreateFeatureFlagState,
  formData: FormData,
): Promise<CreateFeatureFlagState> {
  const values = {
    name: formData.get("name"),
    key: formData.get("key"),
    description: formData.get("description"),
  };

  const submittedValues = {
    name: typeof values.name === "string" ? values.name : "",
    key: typeof values.key === "string" ? values.key : "",
    description:
      typeof values.description === "string" ? values.description : "",
  };

  const projectResult = databaseIdSchema.safeParse(projectId);

  if (!projectResult.success) {
    return {
      success: false,
      formError: "Invalid project ID",
      fieldErrors: {},
      values: submittedValues,
    };
  }

  const formResult = createFeatureFlagSchema.safeParse(values);

  if (!formResult.success) {
    const errors = z.flattenError(formResult.error);

    return {
      success: false,
      formError: null,
      fieldErrors: {
        name: errors.fieldErrors.name,
        key: errors.fieldErrors.key,
        description: errors.fieldErrors.description,
      },
      values: submittedValues,
    };
  }

  const { name, key, description } = formResult.data;

  try {
    await createFeatureFlag(
      projectResult.data,
      name,
      key,
      description || undefined,
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      return {
        success: false,
        formError: null,
        fieldErrors: {
          key: [`A feature flag with the key "${key}" already exists`],
        },
        values: submittedValues,
      };
    }

    throw error;
  }

  revalidatePath(`/projects/${projectId}`);

  return {
    success: true,
    formError: null,
    fieldErrors: {},
    values: {
      name: "",
      key: "",
      description: "",
    },
  };
}
