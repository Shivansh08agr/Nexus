import { Injectable, Logger } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  // Inject the global PrismaService
  constructor(private readonly prisma: PrismaService) {}

  async syncUser(createUserInput: CreateUserInput): Promise<User> {
    this.logger.log(`Syncing user from Google: ${createUserInput.email}`);

    // Upsert: Create the user if they don't exist, or update them if they do.
    const user = await this.prisma.user.upsert({
      where: { email: createUserInput.email },
      update: {
        name: createUserInput.name,
        avatar: createUserInput.avatar,
        googleId: createUserInput.googleId,
      },
      create: {
        email: createUserInput.email,
        name: createUserInput.name,
        avatar: createUserInput.avatar,
        googleId: createUserInput.googleId,
      },
    });

    // 2. Automatically claim any pending invitations for this email
    const pendingInvites = await this.prisma.pendingInvite.findMany({
      where: { email: createUserInput.email },
    });

    if (pendingInvites.length > 0) {
      this.logger.log(`Found ${pendingInvites.length} pending invites for ${createUserInput.email}. Converting to active memberships.`);
      
      for (const invite of pendingInvites) {
        if (invite.workspaceId) {
          await this.prisma.workspaceMember.upsert({
            where: { userId_workspaceId: { userId: user.id, workspaceId: invite.workspaceId } },
            update: {},
            create: { userId: user.id, workspaceId: invite.workspaceId, role: invite.role },
          });
        }
        if (invite.documentId) {
          await this.prisma.documentAccess.upsert({
            where: { userId_documentId: { userId: user.id, documentId: invite.documentId } },
            update: {},
            create: { userId: user.id, documentId: invite.documentId, role: invite.role },
          });
        }
      }

      // Clean up the accepted invites
      await this.prisma.pendingInvite.deleteMany({
        where: { email: createUserInput.email },
      });
    }

    return user as User;
  }
}