import { z } from "zod";

export const featureFlagDetailsSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim(),
});

export const createFeatureFlagSchema = featureFlagDetailsSchema.extend({
  key: z
    .string()
    .trim()
    .min(1, "Key is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Key must use kebab-case"),
});

export const databaseIdSchema = z.string().regex(/^[1-9]\d*$/, "Invalid ID");

export const updateFeatureFlagValueSchema = z.object({
  value: z.boolean(),
  featureFlagId: databaseIdSchema,
  environmentId: databaseIdSchema,
  projectId: databaseIdSchema,
});

export const featureFlagIdentitySchema = z.object({
  projectId: databaseIdSchema,
  featureFlagId: databaseIdSchema,
});
