"use server";

import { createFeatureFlag } from "@/lib/data/create-feature-flag";
import { revalidatePath } from "next/cache";
import {
  deleteFeatureFlag,
  updateFeatureFlagValue,
  updateFeatureFlagDetails,
} from "@/lib/data/feature-flags";
import { redirect } from "next/navigation";
import {
  createFeatureFlagSchema,
  databaseIdSchema,
  featureFlagDetailsSchema,
  featureFlagIdentitySchema,
  updateFeatureFlagValueSchema,
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

export type UpdateFeatureFlagValueState = {
  error: string | null;
};

export async function updateFeatureFlagValueAction(
  value: boolean,
  featureFlagId: string,
  environmentId: string,
  projectId: string,
): Promise<UpdateFeatureFlagValueState> {
  const result = updateFeatureFlagValueSchema.safeParse({
    value,
    featureFlagId,
    environmentId,
    projectId,
  });

  if (!result.success) {
    return { error: "Invalid update request" };
  }

  const {
    value: validValue,
    featureFlagId: validFeatureFlagId,
    environmentId: validEnvironmentId,
    projectId: validProjectId,
  } = result.data;

  const updated = await updateFeatureFlagValue(
    validValue,
    validFeatureFlagId,
    validEnvironmentId,
    validProjectId,
  );

  if (!updated) {
    return {
      error: "Feature flag configuration not found",
    };
  }

  revalidatePath(`/projects/${validProjectId}`);

  return { error: null };
}

type DeleteFeatureFlagState = {
  error: string | null;
};

export async function deleteFeatureFlagAction(
  featureFlagId: string,
  projectId: string,
): Promise<DeleteFeatureFlagState> {
  const result = featureFlagIdentitySchema.safeParse({
    projectId,
    featureFlagId,
  });

  if (!result.success) {
    return { error: "Invalid delete request" };
  }

  const deleted = await deleteFeatureFlag(featureFlagId, projectId);

  if (!deleted) {
    return {
      error: "Feature flag not found",
    };
  }

  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}`);
}

export type UpdateFeatureFlagDetailsState = {
  success: boolean;
  formError: string | null;
  fieldErrors: {
    name?: string[];
    description?: string[];
  };
};

export async function updateFeatureFlagDetailsAction(
  projectId: string,
  featureFlagId: string,
  _previousState: UpdateFeatureFlagDetailsState,
  formData: FormData,
): Promise<UpdateFeatureFlagDetailsState> {
  const identityResult = featureFlagIdentitySchema.safeParse({
    projectId,
    featureFlagId,
  });

  if (!identityResult.success) {
    return {
      success: false,
      formError: "Invalid feature flag",
      fieldErrors: {},
    };
  }
  const detailsResult = featureFlagDetailsSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!detailsResult.success) {
    const errors = z.flattenError(detailsResult.error);

    return {
      success: false,
      formError: null,
      fieldErrors: {
        name: errors.fieldErrors.name,
        description: errors.fieldErrors.description,
      },
    };
  }

  const { projectId: validProjectId, featureFlagId: validFeatureFlagId } =
    identityResult.data;
  const { name, description } = detailsResult.data;

  const updated = await updateFeatureFlagDetails(
    validProjectId,
    validFeatureFlagId,
    name,
    description || null,
  );

  if (!updated) {
    return {
      success: false,
      formError: "Feature flag not found",
      fieldErrors: {},
    };
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/flags/${featureFlagId}`);

  return {
    success: true,
    formError: null,
    fieldErrors: {},
  };
}
