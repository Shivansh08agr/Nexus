"use client";

import { useState } from "react";
import { updateMemberRoleAction } from "@/app/actions/workspace";
import { Shield, ShieldAlert, ShieldCheck, User } from "lucide-react";

const ROLE_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  OWNER: { label: "Owner", color: "#8b5cf6", icon: ShieldAlert },
  ADMIN: { label: "Admin", color: "#3b82f6", icon: ShieldCheck },
  EDITOR: { label: "Editor", color: "#22c55e", icon: Shield },
  VIEWER: { label: "Viewer", color: "#6b7280", icon: User },
};

export function MembersList({
  members,
  workspaceId,
  isManager,
  currentUserId,
}: {
  members: any[];
  workspaceId: string;
  isManager: boolean;
  currentUserId: string;
}) {
  const [updating, setUpdating] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdating(userId);
    await updateMemberRoleAction(workspaceId, userId, newRole);
    setUpdating(null);
  };

  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {members.map((member: any, i: number) => {
        const isSelf = member.user.id === currentUserId;
        const cfg = ROLE_CONFIG[member.role] ?? ROLE_CONFIG.VIEWER;
        const Icon = cfg.icon;

        return (
          <li
            key={member.id}
            className="flex items-center justify-between px-5 py-4 transition-colors"
            style={{
              borderBottom: i < members.length - 1 ? "1px solid #1e1e1e" : "none",
              background: "transparent",
            }}
          >
            {/* User info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                {member.user.avatar ? (
                  <img
                    src={member.user.avatar}
                    alt={member.user.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full"
                  />
                ) : (
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: cfg.color + "33", color: cfg.color }}
                  >
                    {member.user.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold flex items-center gap-2" style={{ color: "#f0ede6" }}>
                  {member.user.name}
                  {isSelf && (
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "#1e1e1e", color: "#6b7280", border: "1px solid #2a2a2a" }}>
                      You
                    </span>
                  )}
                </p>
                <p className="text-xs truncate" style={{ color: "#4b5563" }}>
                  {member.user.email}
                </p>
              </div>
            </div>

            {/* Role badge + selector */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: cfg.color + "18",
                  border: `1px solid ${cfg.color}40`,
                  color: cfg.color,
                }}
              >
                <Icon className="w-3 h-3" />
                {cfg.label}
              </div>

              {isManager && !isSelf && member.role !== "OWNER" && (
                <select
                  disabled={updating === member.user.id}
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.user.id, e.target.value)}
                  style={{
                    background: "#1e1e1e",
                    border: "1px solid #2a2a2a",
                    color: "#a8a29e",
                    borderRadius: "0.375rem",
                    padding: "0.3rem 0.5rem",
                    fontSize: "0.75rem",
                    cursor: updating === member.user.id ? "not-allowed" : "pointer",
                    opacity: updating === member.user.id ? 0.5 : 1,
                    outline: "none",
                  }}
                >
                  <option value="ADMIN">Admin</option>
                  <option value="EDITOR">Editor</option>
                  <option value="VIEWER">Viewer</option>
                </select>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
