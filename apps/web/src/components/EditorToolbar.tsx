"use client";

import { Editor } from "@tiptap/react";
import {
  Bold, Italic, Strikethrough, Underline as UnderlineIcon,
  Highlighter, Heading1, Heading2, Heading3,
  List, ListOrdered, ListTodo, Quote, Code,
} from "lucide-react";

type ToolButtonProps = {
  onClick: () => void;
  active: boolean;
  title: string;
  children: React.ReactNode;
};

function ToolButton({ onClick, active, title, children }: ToolButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      style={{
        background: active ? "#1e1e1e" : "transparent",
        border: active ? "1px solid #3a3a3a" : "1px solid transparent",
        color: active ? "#d97706" : "#6b7280",
        borderRadius: "0.375rem",
        padding: "0.3rem 0.45rem",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.color = "#f0ede6";
          (e.currentTarget as HTMLButtonElement).style.background = "#1a1a1a";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return (
    <span style={{ width: "1px", height: "1.25rem", background: "#2a2a2a", display: "inline-block", margin: "0 0.25rem" }} />
  );
}

export function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const groups = [
    [
      { icon: Heading1, title: "Heading 1", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }) },
      { icon: Heading2, title: "Heading 2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
      { icon: Heading3, title: "Heading 3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
    ],
    [
      { icon: Bold, title: "Bold", action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
      { icon: Italic, title: "Italic", action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
      { icon: UnderlineIcon, title: "Underline", action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive("underline") },
      { icon: Strikethrough, title: "Strikethrough", action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive("strike") },
      { icon: Highlighter, title: "Highlight", action: () => editor.chain().focus().toggleHighlight().run(), active: editor.isActive("highlight") },
    ],
    [
      { icon: List, title: "Bullet List", action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
      { icon: ListOrdered, title: "Ordered List", action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
      { icon: ListTodo, title: "Task List", action: () => editor.chain().focus().toggleTaskList().run(), active: editor.isActive("taskList") },
    ],
    [
      { icon: Quote, title: "Blockquote", action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
      { icon: Code, title: "Code Block", action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive("codeBlock") },
    ],
  ];

  return (
    <div className="flex items-center gap-0.5 flex-wrap">
      {groups.map((group, gi) => (
        <>
          {gi > 0 && <Divider key={`div-${gi}`} />}
          {group.map(({ icon: Icon, title, action, active }) => (
            <ToolButton key={title} onClick={action} active={active} title={title}>
              <Icon className="w-3.5 h-3.5" />
            </ToolButton>
          ))}
        </>
      ))}
    </div>
  );
}