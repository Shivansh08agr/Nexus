import { Injectable } from '@nestjs/common';
import { CreateWorkspaceInput } from './dto/create-workspace.input';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWorkspaceInput: CreateWorkspaceInput) {
    // Step 1: Ensure the user exists in our DB before creating the FK reference.
    // This handles the case where syncUser wasn't called yet (e.g. first workspace creation).
    if (createWorkspaceInput.userEmail) {
      await this.prisma.user.upsert({
        where: { id: createWorkspaceInput.userId },
        update: {
          name: createWorkspaceInput.userName ?? undefined,
          avatar: createWorkspaceInput.userAvatar ?? undefined,
        },
        create: {
          id: createWorkspaceInput.userId,
          email: createWorkspaceInput.userEmail,
          name: createWorkspaceInput.userName ?? 'Unknown',
          googleId: createWorkspaceInput.userGoogleId ?? createWorkspaceInput.userId,
          avatar: createWorkspaceInput.userAvatar ?? null,
        },
      });
    }

    // Step 2: Now it's safe to create the workspace with the member FK
    return this.prisma.workspace.create({
      data: {
        name: createWorkspaceInput.name,
        members: {
          create: {
            userId: createWorkspaceInput.userId,
            role: Role.OWNER,
          },
        },
      },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.workspace.delete({
      where: { id },
    });
  }

  async inviteUser(email: string, workspaceId: string) {
    // 1. Check if user already exists in the system
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Create a WorkspaceMember right away (defaults to VIEWER)
      await this.prisma.workspaceMember.upsert({
        where: {
          userId_workspaceId: {
            userId: existingUser.id,
            workspaceId,
          },
        },
        update: {}, // Do nothing if already a member
        create: {
          userId: existingUser.id,
          workspaceId,
          role: Role.VIEWER,
        },
      });
      return { status: 'ADDED_AS_MEMBER', email };
    } else {
      // Create a PendingInvite
      await this.prisma.pendingInvite.upsert({
        where: {
          email_workspaceId: {
            email,
            workspaceId,
          },
        },
        update: {},
        create: {
          email,
          workspaceId,
          role: Role.VIEWER,
        },
      });
      return { status: 'PENDING_INVITE_CREATED', email };
    }
  }

  async getWorkspaceMembers(workspaceId: string) {
    return this.prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: { user: true },
      orderBy: { joinedAt: 'asc' },
    });
  }

  async updateMemberRole(input: any) {
    return this.prisma.workspaceMember.update({
      where: {
        userId_workspaceId: {
          userId: input.userId,
          workspaceId: input.workspaceId,
        },
      },
      data: { role: input.role as Role },
      include: { user: true }
    });
  }

  async getMyWorkspaceRole(workspaceId: string, userId: string): Promise<string | null> {
    const member = await this.prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId, workspaceId } },
    });
    return member?.role ?? null;
  }
}