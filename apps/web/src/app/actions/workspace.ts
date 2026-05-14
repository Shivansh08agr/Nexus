"use server";

import { auth } from "@/auth";
import { fetchGraphQL } from "@/lib/api/graphql-client";
import { CreateWorkspaceDocument, DeleteWorkspaceDocument } from "@/lib/generated/graphql";
import { print } from "graphql";
import { revalidatePath } from "next/cache";

export async function createWorkspaceAction(formData: FormData) {
  // 1. Verify the user is authenticated
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // 2. Extract the workspace name from the submitted form
  const name = formData.get("name") as string;
  if (!name || name.trim() === "") {
    return { error: "Workspace name is required" };
  }

  // 3. Execute the GraphQL mutation
  try {
    await fetchGraphQL(print(CreateWorkspaceDocument), {
      input: {
        name: name,
        userId: session.user.id,
        // Pass user identity so the backend can upsert the User row if needed
        userEmail: session.user.email,
        userName: session.user.name,
        userAvatar: session.user.image,
      },
    });

    // 4. Force Next.js to refresh the Dashboard to show the new data
    revalidatePath("/dashboard");
    return { success: true };
    
  } catch (error) {
    console.error("Failed to create workspace:", error);
    return { error: "Failed to create workspace. Please try again." };
  }
}

export async function deleteWorkspaceAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    await fetchGraphQL(print(DeleteWorkspaceDocument), { id });
    
    // Force the main dashboard to redraw without the deleted workspace
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete workspace:", error);
    return { error: "Failed to delete workspace" };
  }
}

export async function inviteUserToWorkspaceAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const email = formData.get("email") as string;
  const workspaceId = formData.get("workspaceId") as string;

  if (!email || !workspaceId) return { error: "Missing fields" };

  try {
    // 1. Hit our NestJS backend to register the invite in Postgres
    const { InviteUserDocument } = await import("@/lib/generated/graphql");
    
    const response: any = await fetchGraphQL(print(InviteUserDocument), {
      email,
      workspaceId,
    });

    const status = response.inviteUser?.status;

    // 2. Send the actual email via Resend
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

    // In a real production app, this would be your verified domain
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    
    // We send an email regardless of whether they were a pending invite or an existing user
    await resend.emails.send({
      from: `Nexus <${fromEmail}>`,
      to: email,
      subject: `You've been invited to join a Workspace on Nexus`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Hello!</h2>
          <p>${session.user.name} has invited you to collaborate in their workspace.</p>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Join Workspace
            </a>
          </p>
          <p style="color: #666; font-size: 12px; mt-4;">If you don't have an account yet, one will be created when you sign in with Google using this email address.</p>
        </div>
      `,
    });

    revalidatePath(`/dashboard/${workspaceId}`);
    return { success: true, status };
  } catch (error) {
    console.error("Failed to invite user:", error);
    return { error: "Failed to invite user" };
  }
}

export async function updateMemberRoleAction(workspaceId: string, userId: string, role: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    const { UpdateMemberRoleDocument } = await import("@/lib/generated/graphql");
    await fetchGraphQL(print(UpdateMemberRoleDocument), {
      workspaceId,
      userId,
      role,
    });
    
    revalidatePath(`/dashboard/${workspaceId}/members`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update role:", error);
    return { error: "Failed to update role" };
  }
}