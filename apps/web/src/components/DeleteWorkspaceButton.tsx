"use client";

import { useTransition } from "react";
import { deleteWorkspaceAction } from "@/app/actions/workspace";
import { Trash2 } from "lucide-react";

export function DeleteWorkspaceButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Delete this workspace and ALL documents inside it? This is permanent.")) {
      startTransition(async () => {
        await deleteWorkspaceAction(id);
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      title="Delete workspace"
      style={{
        background: "#1a0a0a",
        border: "1px solid #7f1d1d",
        color: "#f87171",
        borderRadius: "0.375rem",
        padding: "0.375rem 0.625rem",
        fontSize: "0.75rem",
        fontWeight: 500,
        cursor: isPending ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        transition: "all 0.2s",
        opacity: isPending ? 0.7 : 1,
      }}
    >
      {isPending ? (
        <span className="w-3.5 h-3.5 border-2 rounded-full animate-spin"
          style={{ borderColor: "rgba(248,113,113,0.3)", borderTopColor: "#f87171" }} />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}