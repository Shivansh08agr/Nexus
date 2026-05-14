"use server";

import { auth } from "@/auth";
import { fetchGraphQL } from "@/lib/api/graphql-client";
import { CreateDocumentDocument, DeleteDocumentDocument } from "@/lib/generated/graphql";
import { print } from "graphql";
import { redirect } from "next/navigation";
import { UpdateDocumentDocument } from "@/lib/generated/graphql";
import { revalidatePath } from "next/cache";

export async function createDocumentAction(workspaceId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  let newDocumentId = "";

  try {
    const data: any = await fetchGraphQL(print(CreateDocumentDocument), {
      input: {
        title: "Untitled Document", // Default title
        workspaceId: workspaceId,
        authorId: session.user.id,
      },
    });

    newDocumentId = data?.createDocument?.id;
  } catch (error) {
    console.error("Failed to create document:", error);
    throw new Error("Failed to create document");
  }

  if (newDocumentId) {
    redirect(`/dashboard/${workspaceId}/${newDocumentId}`);
  }
}

export async function updateDocumentAction(id: string, title: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    await fetchGraphQL(print(UpdateDocumentDocument), {
      input: {
        id,
        title,
        content: "{}",
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to update document:", error);
    return { error: "Failed to update document" };
  }
}

export async function deleteDocumentAction(id: string, workspaceId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    await fetchGraphQL(print(DeleteDocumentDocument), {
      id: id,
    });
    
    // Force the workspace view to redraw without the deleted document
    revalidatePath(`/dashboard/${workspaceId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete document:", error);
    return { error: "Failed to delete document" };
  }
}