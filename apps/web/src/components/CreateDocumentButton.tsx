"use client";

import { useTransition } from "react";
import { createDocumentAction } from "../app/actions/document";
import { Plus } from "lucide-react";

export function CreateDocumentButton({ workspaceId }: { workspaceId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => createDocumentAction(workspaceId))}
      disabled={isPending}
      className="btn-primary"
      style={{ cursor: isPending ? "not-allowed" : "pointer", opacity: isPending ? 0.7 : 1 }}
    >
      {isPending ? (
        <>
          <span className="w-4 h-4 border-2 rounded-full animate-spin"
            style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }} />
          Creating…
        </>
      ) : (
        <>
          <Plus className="w-4 h-4" />
          New Document
        </>
      )}
    </button>
  );
}