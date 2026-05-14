import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchGraphQL } from "@/lib/api/graphql-client";
import { GetWorkspaceMembersDocument } from "@/lib/generated/graphql";
import { print } from "graphql";
import { MembersList } from "./MembersList";
import { InviteForm } from "./InviteForm";
import { Users } from "lucide-react";

export default async function WorkspaceMembersPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  let members: any[] = [];
  try {
    const data: any = await fetchGraphQL(print(GetWorkspaceMembersDocument), {
      workspaceId: resolvedParams.workspaceId,
    });
    members = data?.workspaceMembers || [];
  } catch (error) {
    console.error("Failed to fetch members:", error);
  }

  const currentUserMember = members.find((m: any) => m.user.id === session.user?.id);
  const isManager =
    currentUserMember?.role === "OWNER" || currentUserMember?.role === "ADMIN";

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#d97706" }}>
          Workspace
        </p>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#f0ede6" }}>
              Members
            </h1>
            <p className="mt-1" style={{ color: "#6b7280" }}>
              {members.length} member{members.length !== 1 ? "s" : ""} in this workspace
            </p>
          </div>
          {isManager && <InviteForm workspaceId={resolvedParams.workspaceId} />}
        </div>
        <div className="nexus-gold-bar mt-6" />
      </div>

      {/* Members list */}
      {members.length === 0 ? (
        <div className="nexus-card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "#1e1e1e", border: "1px solid #2a2a2a" }}>
            <Users className="w-8 h-8" style={{ color: "#4b5563" }} />
          </div>
          <p style={{ color: "#6b7280" }}>No members found.</p>
        </div>
      ) : (
        <div className="nexus-card overflow-hidden">
          <MembersList
            members={members}
            workspaceId={resolvedParams.workspaceId}
            isManager={isManager}
            currentUserId={session.user.id!}
          />
        </div>
      )}
    </div>
  );
}
