"use client";

import { useTransition } from "react";
import { deleteDocumentAction } from "@/app/actions/document";
import { Trash2 } from "lucide-react";

export function DeleteDocumentButton({ id, workspaceId }: { id: string; workspaceId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Delete this document? This cannot be undone.")) {
      startTransition(async () => {
        await deleteDocumentAction(id, workspaceId);
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      title="Delete document"
      style={{
        background: "transparent",
        border: "none",
        color: "#6b7280",
        borderRadius: "0.375rem",
        padding: "0.375rem",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        transition: "all 0.15s",
        opacity: isPending ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
        (e.currentTarget as HTMLButtonElement).style.background = "#1a0a0a";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
      }}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}