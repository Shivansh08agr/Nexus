"use client";

import { useState, useRef } from "react";
import { createWorkspaceAction } from "@/app/actions/workspace";
import { Plus, X, Check } from "lucide-react";

export function CreateWorkspaceForm({ compact = false }: { compact?: boolean }) {
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  if (isCreating) {
    return (
      <form
        ref={formRef}
        action={async (formData) => {
          if (isSubmitting) return;
          setIsSubmitting(true);
          try {
            await createWorkspaceAction(formData);
            setIsCreating(false);
          } finally {
            setIsSubmitting(false);
          }
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
          disabled={isSubmitting}
          className="nexus-input"
          style={{ opacity: isSubmitting ? 0.7 : 1 }}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            disabled={isSubmitting}
            className="btn-ghost flex-1"
            style={{ cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1 }}
          >
            <X className="w-4 h-4" /> Cancel
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary flex-1" 
            style={{ cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 rounded-full animate-spin"
                style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }} />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {isSubmitting ? "Creating…" : "Create"}
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