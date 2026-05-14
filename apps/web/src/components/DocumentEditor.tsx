"use client";

import { useState, useEffect, useTransition } from "react";
import { useSession, SessionProvider } from "next-auth/react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { updateDocumentAction } from "@/app/actions/document";
import { EditorToolbar } from "./EditorToolbar";
import { Eye, Wifi, WifiOff, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

const getColorForUser = (identifier: string) => {
  const colors = ["#d97706", "#dc2626", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899"];
  let hash = 0;
  for (let i = 0; i < identifier.length; i++)
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

// ── Active Users ─────────────────────────────────────────────
function ActiveUsers({ provider }: { provider: HocuspocusProvider }) {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const update = () => {
      const states = Array.from(provider.awareness?.getStates()?.values() || []);
      const active = states.map((s: any) => s.user).filter(Boolean);
      const unique = active.filter((v, i, a) => a.findIndex((t) => t.name === v.name) === i);
      setUsers(unique);
    };
    provider?.awareness?.on?.("change", update);
    update();
    return () => provider?.awareness?.off?.("change", update);
  }, [provider]);

  if (users.length === 0) return null;

  return (
    <div className="flex items-center -space-x-2">
      {users.slice(0, 5).map((user, i) => (
        <div
          key={i}
          className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold overflow-hidden"
          style={{
            backgroundColor: user.color,
            borderColor: "#0f0f0f",
            zIndex: 10 - i,
            color: "#0f0f0f",
          }}
          title={user.name}
        >
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user.name?.[0]?.toUpperCase()
          )}
        </div>
      ))}
      {users.length > 5 && (
        <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: "#2a2a2a", borderColor: "#0f0f0f", color: "#9ca3af" }}>
          +{users.length - 5}
        </div>
      )}
    </div>
  );
}

// ── Root export (wraps in SessionProvider) ───────────────────
export function DocumentEditor({
  id,
  initialTitle,
  initialContent,
  isReadonly = false,
}: {
  id: string;
  initialTitle: string;
  initialContent: string;
  isReadonly?: boolean;
}) {
  return (
    <SessionProvider>
      <ConnectionManager id={id} initialTitle={initialTitle} isReadonly={isReadonly} />
    </SessionProvider>
  );
}

// ── Connection Manager ───────────────────────────────────────
function ConnectionManager({
  id,
  initialTitle,
  isReadonly,
}: {
  id: string;
  initialTitle: string;
  isReadonly: boolean;
}) {
  const { data: session, status } = useSession();
  const [isReady, setIsReady] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<HocuspocusProvider | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;

    const wsUrl =
      process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://127.0.0.1:8081";
    const newYdoc = new Y.Doc();

    const newProvider = new HocuspocusProvider({
      url: wsUrl,
      name: id,
      document: newYdoc,
      token: session.user.id,
      onAuthenticationFailed: () => setAccessDenied(true),
    });

    setYdoc(newYdoc);
    setProvider(newProvider);

    const handleSynced = () => setIsReady(true);
    newProvider.on("synced", handleSynced);

    return () => {
      newProvider.off("synced", handleSynced);
      newProvider.destroy();
      newYdoc.destroy();
      setIsReady(false);
    };
  }, [id, status, session]);

  if (status === "loading") {
    return <LoadingState label="Verifying identity…" />;
  }

  if (accessDenied) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: "#1a0a0a", border: "1px solid #7f1d1d" }}>
          <Eye className="w-8 h-8" style={{ color: "#ef4444" }} />
        </div>
        <h2 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#f0ede6" }}>
          Access Denied
        </h2>
        <p className="text-center max-w-sm" style={{ color: "#6b7280" }}>
          You don't have permission to view this document. Ask the owner to invite you.
        </p>
        <a href="/dashboard" className="btn-primary" style={{ cursor: "pointer", textDecoration: "none" }}>
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </a>
      </div>
    );
  }

  if (!isReady || !ydoc || !provider) {
    return <LoadingState label="Connecting to workspace…" />;
  }

  return (
    <LiveEditor
      id={id}
      initialTitle={initialTitle}
      ydoc={ydoc}
      provider={provider}
      isReadonly={isReadonly}
    />
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <div className="w-6 h-6 rounded-full border-2 animate-spin"
        style={{ borderColor: "#2a2a2a", borderTopColor: "#d97706" }} />
      <p className="text-sm animate-pulse" style={{ color: "#6b7280" }}>{label}</p>
    </div>
  );
}

// ── Live Editor ──────────────────────────────────────────────
function LiveEditor({
  id,
  initialTitle,
  ydoc,
  provider,
  isReadonly,
}: {
  id: string;
  initialTitle: string;
  ydoc: Y.Doc;
  provider: HocuspocusProvider;
  isReadonly: boolean;
}) {
  const { data: session, status: authStatus } = useSession();
  const [title, setTitle] = useState(initialTitle);
  const [connStatus, setConnStatus] = useState<"live" | "saving" | "saved" | "offline">("live");
  const [isPending, startTransition] = useTransition();

  const userName =
    session?.user?.name || session?.user?.email?.split("@")[0] || "Anonymous";
  const userColor = getColorForUser(session?.user?.email || "anonymous");

  const editor = useEditor({
    editable: !isReadonly,
    extensions: [
      StarterKit.configure({ undoRedo: false }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Underline,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({
        placeholder: isReadonly
          ? "This document is read-only."
          : "Start writing, or press '/' for commands…",
        emptyEditorClass: "is-editor-empty",
      }),
      Collaboration.configure({ document: ydoc }),
      CollaborationCaret.configure({
        provider,
        user: { name: userName, color: userColor },
      }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[60vh]",
        style: "color: #e5e1d8; caret-color: #d97706;",
      },
    },
  });

  useEffect(() => {
    const handleClose = () => setConnStatus("offline");
    const handleSync = () => setConnStatus("live");
    provider.on("close", handleClose);
    provider.on("synced", handleSync);
    return () => {
      provider.off("close", handleClose);
      provider.off("synced", handleSync);
    };
  }, [provider]);

  useEffect(() => {
    if (authStatus === "authenticated" && session?.user && provider) {
      provider.awareness?.setLocalStateField("user", {
        name: session.user.name || session.user.email?.split("@")[0] || "Collaborator",
        color: getColorForUser(session.user.email || "anonymous"),
        avatar: session.user.image,
      });
    }
  }, [authStatus, session, provider]);

  const handleSave = () => {
    if (!editor || isReadonly) return;
    startTransition(async () => {
      setConnStatus("saving");
      await updateDocumentAction(id, title, JSON.stringify(editor.getJSON()));
      setConnStatus("saved");
      setTimeout(() => setConnStatus("live"), 2000);
    });
  };

  if (!editor)
    return <LoadingState label="Initializing editor…" />;

  const statusConfig = {
    live: { label: "Live", color: "#22c55e" },
    saving: { label: "Saving…", color: "#d97706" },
    saved: { label: "Saved", color: "#22c55e" },
    offline: { label: "Offline", color: "#ef4444" },
  };
  const currentStatus = statusConfig[connStatus];

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: "#0f0f0f" }}>
      {/* ── Top Bar ── */}
      <div
        className="flex items-center justify-between px-6 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid #1e1e1e", background: "#111" }}
      >
        {/* Left: Title input */}
        <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
          {isReadonly && (
            <span className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0"
              style={{ background: "#1a0a0a", color: "#f87171", border: "1px solid #7f1d1d" }}>
              <Eye className="w-3 h-3" /> View only
            </span>
          )}
          <input
            type="text"
            value={title}
            onChange={(e) => !isReadonly && setTitle(e.target.value)}
            readOnly={isReadonly}
            className="font-bold text-lg bg-transparent border-none focus:outline-none truncate flex-1"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "#f0ede6",
              cursor: isReadonly ? "default" : "text",
            }}
            placeholder="Untitled Document"
          />
        </div>

        {/* Right: Status + Users + Save */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <ActiveUsers provider={provider} />

          <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#6b7280" }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentStatus.color }} />
            {currentStatus.label}
          </div>

          {!isReadonly && (
            <button
              onClick={handleSave}
              disabled={isPending || connStatus === "offline"}
              className="btn-gold"
              style={{ cursor: isPending || connStatus === "offline" ? "not-allowed" : "pointer", opacity: isPending ? 0.7 : 1 }}
            >
              <Save className="w-4 h-4" />
              {isPending ? "Saving…" : "Save"}
            </button>
          )}
        </div>
      </div>

      {/* ── Toolbar (editor only) ── */}
      {!isReadonly && (
        <div className="flex-shrink-0 px-4 py-2" style={{ borderBottom: "1px solid #1a1a1a", background: "#111" }}>
          <EditorToolbar editor={editor} />
        </div>
      )}

      {/* ── Editor Content ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-10">
          {/* Typography styles injected inline for dark theme */}
          <style>{`
            .ProseMirror h1 { font-size: 2rem; font-weight: 700; color: #f0ede6; margin-bottom: 0.5rem; font-family: 'Space Grotesk', sans-serif; }
            .ProseMirror h2 { font-size: 1.5rem; font-weight: 600; color: #e5e1d8; margin-bottom: 0.4rem; font-family: 'Space Grotesk', sans-serif; }
            .ProseMirror h3 { font-size: 1.25rem; font-weight: 600; color: #d6d2ca; margin-bottom: 0.3rem; font-family: 'Space Grotesk', sans-serif; }
            .ProseMirror p  { line-height: 1.8; color: #c8c4bb; margin-bottom: 0.75rem; }
            .ProseMirror strong { color: #f0ede6; font-weight: 700; }
            .ProseMirror em { color: #c8c4bb; font-style: italic; }
            .ProseMirror s { color: #6b7280; text-decoration: line-through; }
            .ProseMirror code { background: #1e1e1e; border: 1px solid #2a2a2a; color: #d97706; padding: 0.1em 0.4em; border-radius: 0.25rem; font-size: 0.875em; }
            .ProseMirror pre  { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 0.5rem; padding: 1rem 1.25rem; overflow-x: auto; }
            .ProseMirror pre code { background: none; border: none; color: #d4d0c8; padding: 0; }
            .ProseMirror blockquote { border-left: 3px solid #d97706; padding-left: 1rem; color: #9ca3af; margin: 1rem 0; font-style: italic; }
            .ProseMirror ul:not([data-type="taskList"]) { padding-left: 1.5rem; list-style: disc; color: #c8c4bb; }
            .ProseMirror ol  { padding-left: 1.5rem; list-style: decimal; color: #c8c4bb; }
            .ProseMirror mark { background: #78350f; color: #fbbf24; border-radius: 0.2rem; padding: 0 0.15em; }
            .ProseMirror hr  { border: none; border-top: 1px solid #2a2a2a; margin: 2rem 0; }
          `}</style>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}