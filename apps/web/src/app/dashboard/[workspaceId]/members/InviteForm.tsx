"use client";

import { useState } from "react";
import { inviteUserToWorkspaceAction } from "@/app/actions/workspace";
import { UserPlus, Check, X } from "lucide-react";

export function InviteForm({ workspaceId }: { workspaceId: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("workspaceId", workspaceId);

    const result = await inviteUserToWorkspaceAction(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setEmail("");
      setTimeout(() => setSuccess(false), 4000);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Invite by email…"
        className="nexus-input"
        style={{ width: "220px" }}
      />

      <button
        type="submit"
        disabled={loading}
        className="btn-primary flex-shrink-0"
        style={{ cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
      >
        <UserPlus className="w-4 h-4" />
        {loading ? "Sending…" : "Invite"}
      </button>

      {success && (
        <span className="flex items-center gap-1 text-xs font-semibold"
          style={{ color: "#22c55e" }}>
          <Check className="w-3.5 h-3.5" /> Sent!
        </span>
      )}
      {error && (
        <span className="flex items-center gap-1 text-xs font-semibold"
          style={{ color: "#ef4444" }}>
          <X className="w-3.5 h-3.5" /> {error}
        </span>
      )}
    </form>
  );
}
