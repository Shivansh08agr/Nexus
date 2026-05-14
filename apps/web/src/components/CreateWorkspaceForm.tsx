"use client";

import { useState, useRef } from "react";
import { createWorkspaceAction } from "@/app/actions/workspace";
import { Plus, X, Check } from "lucide-react";

export function CreateWorkspaceForm({ compact = false }: { compact?: boolean }) {
  const [isCreating, setIsCreating] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  if (isCreating) {
    return (
      <form
        ref={formRef}
        action={async (formData) => {
          await createWorkspaceAction(formData);
          setIsCreating(false);
        }}
        className="flex flex-col gap-2 w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="text"
          name="name"
          placeholder="e.g. Engineering Team"
          required
          autoFocus
          className="nexus-input"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            className="btn-ghost flex-1"
            style={{ cursor: "pointer" }}
          >
            <X className="w-4 h-4" /> Cancel
          </button>
          <button type="submit" className="btn-primary flex-1" style={{ cursor: "pointer" }}>
            <Check className="w-4 h-4" /> Create
          </button>
        </div>
      </form>
    );
  }

  if (compact) {
    return (
      <button
        onClick={() => setIsCreating(true)}
        className="text-sm font-medium"
        style={{ color: "#6b7280", cursor: "pointer" }}
      >
        New workspace
      </button>
    );
  }

  return (
    <button
      onClick={() => setIsCreating(true)}
      className="btn-primary"
      style={{ cursor: "pointer" }}
    >
      <Plus className="w-4 h-4" /> New Workspace
    </button>
  );
}