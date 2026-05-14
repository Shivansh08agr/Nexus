import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchGraphQL } from "@/lib/api/graphql-client";
import { GetUserWorkspacesDocument } from "@/lib/generated/graphql";
import { print } from "graphql";
import { CreateWorkspaceForm } from "@/components/CreateWorkspaceForm";
import Link from "next/link";
import { DeleteWorkspaceButton } from "@/components/DeleteWorkspaceButton";
import { Plus, FolderOpen, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  let workspaces: any[] = [];
  try {
    const data: any = await fetchGraphQL(
      print(GetUserWorkspacesDocument),
      { userId: session.user.id }
    );
    workspaces = data?.workspaces || [];
  } catch (error) {
    console.error("GraphQL Fetch Error:", error);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#d97706" }}>
          Your workspace
        </p>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#f0ede6" }}>
              Welcome back, {session.user.name?.split(" ")[0]}
            </h1>
            <p className="mt-2" style={{ color: "#6b7280" }}>
              {workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""} available
            </p>
          </div>
          <CreateWorkspaceForm />
        </div>
        <div className="nexus-gold-bar mt-6" />
      </div>

      {/* Grid */}
      {workspaces.length === 0 ? (
        <div className="nexus-card p-16 text-center animate-fade-up">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "#1e1e1e", border: "1px solid #2a2a2a" }}>
            <FolderOpen className="w-8 h-8" style={{ color: "#4b5563" }} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            No workspaces yet
          </h3>
          <p className="text-sm mb-6" style={{ color: "#6b7280" }}>
            Create your first workspace to start collaborating.
          </p>
          <CreateWorkspaceForm />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((workspace: any, i: number) => (
            <div key={workspace.id} className="nexus-card group relative animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}>
              {/* Delete button - top right */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <DeleteWorkspaceButton id={workspace.id} />
              </div>

              <Link href={`/dashboard/${workspace.id}`} className="block p-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "#1e1e1e", border: "1px solid #2a2a2a" }}>
                  <FolderOpen className="w-5 h-5" style={{ color: "#d97706" }} />
                </div>
                <h3 className="font-semibold mb-1 pr-6 truncate"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#f0ede6" }}>
                  {workspace.name}
                </h3>
                <p className="text-xs mb-5" style={{ color: "#4b5563" }}>
                  Created {new Date(workspace.createdAt).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-1 text-xs font-medium transition-all"
                  style={{ color: "#6b7280" }}>
                  Open workspace
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          ))}

          {/* Add workspace card */}
          <div className="nexus-card p-6 flex flex-col items-center justify-center gap-3 min-h-[160px] cursor-pointer group"
            style={{ border: "1px dashed #2a2a2a" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}>
              <Plus className="w-5 h-5" style={{ color: "#4b5563" }} />
            </div>
            <CreateWorkspaceForm compact />
          </div>
        </div>
      )}
    </div>
  );
}