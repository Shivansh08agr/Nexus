"use client";

import { useTransition } from "react";
import { createDocumentAction } from "../app/actions/document";
import { Plus } from "lucide-react";
import {useState} from 'react'

export function CreateDocumentButton({ workspaceId }: { workspaceId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (isPending) return;
    startTransition(async () => {
      await createDocumentAction(workspaceId);
    });
  };

  const disabled = isPending;

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="btn-primary"
      style={{ cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.7 : 1 }}
    >
      {disabled ? (
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