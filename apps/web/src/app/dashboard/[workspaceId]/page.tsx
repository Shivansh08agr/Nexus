import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchGraphQL } from "@/lib/api/graphql-client";
import { GetWorkspaceDocumentsDocument } from "@/lib/generated/graphql";
import { print } from "graphql";
import Link from "next/link";
import { CreateDocumentButton } from "@/components/CreateDocumentButton";
import { DeleteDocumentButton } from "@/components/DeleteDocumentButton";
import { FileText, Clock, Users } from "lucide-react";

export default async function WorkspaceViewPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  let documents: any[] = [];
  try {
    const data: any = await fetchGraphQL(
      print(GetWorkspaceDocumentsDocument),
      { workspaceId: resolvedParams.workspaceId }
    );
    documents = data?.workspaceDocuments || [];
  } catch (error) {
    console.error("Failed to fetch documents:", error);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#d97706" }}>
          Workspace
        </p>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#f0ede6" }}>
              Documents
            </h1>
            <p className="mt-1" style={{ color: "#6b7280" }}>
              {documents.length} document{documents.length !== 1 ? "s" : ""} in this workspace
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/${resolvedParams.workspaceId}/members`}
              className="btn-ghost"
              style={{ cursor: "pointer" }}
            >
              <Users className="w-4 h-4" />
              Members
            </Link>
            <CreateDocumentButton workspaceId={resolvedParams.workspaceId} />
          </div>
        </div>
        <div className="nexus-gold-bar mt-6" />
      </div>

      {/* Documents */}
      {documents.length === 0 ? (
        <div className="nexus-card p-16 text-center animate-fade-up">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "#1e1e1e", border: "1px solid #2a2a2a" }}>
            <FileText className="w-8 h-8" style={{ color: "#4b5563" }} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            No documents yet
          </h3>
          <p className="text-sm mb-6" style={{ color: "#6b7280" }}>
            Create your first document to start writing.
          </p>
          <CreateDocumentButton workspaceId={resolvedParams.workspaceId} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc: any, i: number) => (
            <div key={doc.id} className="nexus-card group relative animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}>
              {/* Delete — shows on hover */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <DeleteDocumentButton id={doc.id} workspaceId={resolvedParams.workspaceId} />
              </div>

              <Link href={`/dashboard/${resolvedParams.workspaceId}/${doc.id}`} className="block p-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "#1e1e1e", border: "1px solid #2a2a2a" }}>
                  <FileText className="w-5 h-5" style={{ color: "#dc2626" }} />
                </div>
                <h3 className="font-semibold mb-3 pr-6 truncate"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#f0ede6" }}>
                  {doc.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "#4b5563" }}>
                  <Clock className="w-3 h-3" />
                  Updated {new Date(doc.updatedAt).toLocaleDateString()}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}