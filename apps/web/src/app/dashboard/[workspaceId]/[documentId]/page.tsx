import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchGraphQL } from "@/lib/api/graphql-client";
import { GetDocumentDocument, GetMyWorkspaceRoleDocument } from "@/lib/generated/graphql";
import { print } from "graphql";
import { DocumentEditor } from "@/components/DocumentEditor";

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ workspaceId: string; documentId: string }>;
}) {
  const resolvedParams = await params;
  const session = await auth();

  if (!session?.user?.id) redirect("/");

  // Fetch the document
  let document: any = null;
  try {
    const data: any = await fetchGraphQL(print(GetDocumentDocument), {
      id: resolvedParams.documentId,
    });
    document = data?.document;
  } catch (error) {
    console.error("Failed to fetch document:", error);
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen" style={{ background: "#0f0f0f" }}>
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2" style={{ color: "#f0ede6" }}>Document not found</h2>
          <p style={{ color: "#6b7280" }}>This document may have been deleted.</p>
        </div>
      </div>
    );
  }

  // ── Server-side role check for read-only enforcement ──
  // OWNER is the document author — always has full access.
  // For everyone else, check their WorkspaceMember role.
  let isReadonly = false;

  if (document.authorId !== session.user.id) {
    try {
      const roleData: any = await fetchGraphQL(print(GetMyWorkspaceRoleDocument), {
        workspaceId: resolvedParams.workspaceId,
        userId: session.user.id,
      });
      const role = roleData?.getMyWorkspaceRole;
      // VIEWER → read-only. EDITOR/ADMIN/OWNER → editable.
      isReadonly = !role || role === "VIEWER";
    } catch {
      // If we can't determine role, default to read-only for safety
      isReadonly = true;
    }
  }

  return (
    <div className="h-screen flex flex-col" style={{ background: "#0f0f0f" }}>
      <DocumentEditor
        id={document.id}
        initialTitle={document.title}
        initialContent={document.content || ""}
        isReadonly={isReadonly}
      />
    </div>
  );
}