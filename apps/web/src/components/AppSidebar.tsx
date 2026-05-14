"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, LogOut, Users, FileText, ChevronRight } from "lucide-react";

interface AppSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  workspaceId?: string;
}

export function AppSidebar({ user, workspaceId }: AppSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    ...(workspaceId
      ? [
          {
            href: `/dashboard/${workspaceId}`,
            label: "Workspace",
            icon: FileText,
            exact: true,
          },
          {
            href: `/dashboard/${workspaceId}/members`,
            label: "Members",
            icon: Users,
            exact: true,
          },
        ]
      : []),
  ];

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-60 min-h-screen flex flex-col" style={{
      background: "#111",
      borderRight: "1px solid #1e1e1e",
    }}>
      {/* Logo */}
      <div className="px-5 py-6 border-b" style={{ borderColor: "#1e1e1e" }}>
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <img src="/favicon.ico" alt="Nexus Logo" className="w-8 h-8" />
          <span className="font-bold text-lg tracking-tight" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: "#f0ede6",
          }}>
            Nexus
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group"
              style={{
                color: active ? "#f0ede6" : "#6b7280",
                background: active ? "#1e1e1e" : "transparent",
                borderLeft: active ? "2px solid #dc2626" : "2px solid transparent",
                cursor: "pointer",
              }}
            >
              <Icon
                className="w-4 h-4 flex-shrink-0 transition-colors"
                style={{ color: active ? "#dc2626" : "#4b5563" }}
              />
              {item.label}
              {active && (
                <ChevronRight className="w-3 h-3 ml-auto" style={{ color: "#dc2626" }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="nexus-gold-bar mx-4 mb-4" />

      {/* User + Sign Out */}
      <div className="px-4 pb-5">
        <div className="flex items-center gap-3 mb-3 px-2">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full"
              style={{ outline: "2px solid #2a2a2a" }}
            />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "#d97706", color: "#fff" }}>
              {user.name?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: "#f0ede6" }}>
              {user.name}
            </p>
            <p className="text-xs truncate" style={{ color: "#6b7280" }}>
              {user.email}
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group"
          style={{
            color: "#6b7280",
            background: "transparent",
            border: "1px solid #1e1e1e",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#7f1d1d";
            (e.currentTarget as HTMLButtonElement).style.background = "#1a0a0a";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e1e1e";
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
