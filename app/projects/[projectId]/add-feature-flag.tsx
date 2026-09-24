"use client";

import { useState } from "react";
import { AddFeatureFlagForm } from "@/app/projects/[projectId]/add-feature-flag-form";
import { Button } from "@/components/ui/button";

type AddFeatureFlagProps = {
  projectId: string;
};

export function AddFeatureFlag({ projectId }: AddFeatureFlagProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <div className="mb-4 flex justify-end">
        <Button type="button" variant="primary" onClick={() => setIsOpen(true)}>
          Add New Flag
        </Button>
      </div>
    );
  }

  return (
    <AddFeatureFlagForm
      projectId={projectId}
      onClose={() => setIsOpen(false)}
    />
  );
}
