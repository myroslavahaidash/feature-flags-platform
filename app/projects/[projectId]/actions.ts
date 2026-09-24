"use server";

import { createFeatureFlag } from "@/lib/data/create-feature-flag";
import { revalidatePath } from "next/cache";

export type CreateFeatureFlagState = {
  error: string | null;
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
  const nameValue = formData.get("name");
  const keyValue = formData.get("key");
  const descriptionValue = formData.get("description");

  const values = {
    name: typeof nameValue === "string" ? nameValue : "",
    key: typeof keyValue === "string" ? keyValue : "",
    description: typeof descriptionValue === "string" ? descriptionValue : "",
  };

  if (!/^\d+$/.test(projectId)) {
    return { error: "Invalid project ID", values };
  }

  if (typeof nameValue !== "string" || nameValue.trim() === "") {
    return { error: "Name is required", values };
  }

  if (typeof keyValue !== "string" || keyValue.trim() === "") {
    return { error: "Key is required", values };
  }

  const name = nameValue.trim();
  const key = keyValue.trim();
  const description =
    typeof descriptionValue === "string"
      ? descriptionValue.trim() || undefined
      : undefined;

  const kebabCasePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  if (!kebabCasePattern.test(key)) {
    return { error: "Key must use kebab-case", values };
  }

  try {
    await createFeatureFlag(projectId, name, key, description);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      return {
        error: `A feature flag with the key "${key}" already exists`,
        values,
      };
    }

    throw error;
  }

  revalidatePath(`/projects/${projectId}`);

  return { error: null, values: { name: "", key: "", description: "" } };
}
