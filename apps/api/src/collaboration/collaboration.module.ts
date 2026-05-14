import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { Hocuspocus } from '@hocuspocus/server';
import { TiptapTransformer } from '@hocuspocus/transformer';
import StarterKit from '@tiptap/starter-kit';

import { PrismaService } from '../prisma/prisma.service'; 

@Module({
  providers: [PrismaService], 
})
export class CollaborationModule implements OnModuleInit {
  private readonly logger = new Logger(CollaborationModule.name);
  
  // 1. ADDED THIS LINE: Publicly expose the server instance
  public hocuspocusServer: any;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const prismaClient = this.prisma; 

    const server = new Hocuspocus({
      // 2. REMOVED THE 'port' PROPERTY ENTIRELY 

      async onAuthenticate(data) {
        const userId = data.token;
        if (!userId) {
          throw new Error('Not authorized: No token provided');
        }

        // We need to know which document they are trying to access
        const documentId = data.documentName;

        // Fetch the document and its workspace to check permissions
        const document = await prismaClient.document.findUnique({
          where: { id: documentId },
          include: {
            workspace: {
              include: {
                members: {
                  where: { userId: userId }
                }
              }
            },
            collaborators: {
              where: { userId: userId }
            }
          }
        });

        if (!document) {
          throw new Error('Document not found');
        }

        // Did they create the document?
        if (document.authorId === userId) {
          return { user: { id: userId, readonly: false } }; // Full access
        }

        // Are they a member of the workspace?
        const workspaceMember = document.workspace.members[0];
        
        // Are they explicitly granted document access?
        const docAccess = document.collaborators[0];

        if (!workspaceMember && !docAccess) {
          throw new Error('Forbidden: You do not have access to this document');
        }

        // Determine their highest role (DocumentAccess overrides WorkspaceMember)
        const role = docAccess ? docAccess.role : workspaceMember.role;

        // If their role is VIEWER, they get Read-Only access
        if (role === 'VIEWER') {
          return { user: { id: userId, readonly: true } };
        }

        // Otherwise, they are an EDITOR, ADMIN, or OWNER
        return { user: { id: userId, readonly: false } };
      },

      // 1. LOAD THE DOCUMENT (Fires when the first user opens the page)
      async onLoadDocument(data) {
        try {
          const record = await prismaClient.document.findUnique({
            where: { id: data.documentName },
          });

          // If the database has content, check if it is our saved JSON format
          if (record && record.content && record.content.startsWith('{')) {
            const json = JSON.parse(record.content);
            // Translate the JSON back into a live Yjs memory document
            return TiptapTransformer.toYdoc(json, 'default', [StarterKit]);
          }
        } catch (error) {
          console.error(`Error loading document ${data.documentName}:`, error);
        }
        
        // If no document exists yet, return an empty Yjs document
        return data.document;
      },
      
      // 2. SAVE THE DOCUMENT (Fires automatically when typing pauses)
      async onStoreDocument(data) {
        try {
          const json = TiptapTransformer.fromYdoc(data.document, 'default');
          const jsonString = JSON.stringify(json);

          await prismaClient.document.update({
            where: { id: data.documentName },
            data: { content: jsonString },
          });

          console.log(`Saved document ${data.documentName} to PostgreSQL`);
        } catch (error) {
          console.error(`Failed to save document ${data.documentName}:`, error);
        }
      },

      // 3. SERVER-SIDE SECURITY ENFORCEMENT
      // Prevent read-only users from modifying the document state in memory
      async onChange(data) {
        // data.context is what we returned from onAuthenticate
        if (data.context?.user?.readonly) {
          throw new Error('You have read-only access and cannot modify this document.');
        }
      },
    });

    // 3. REPLACED server.listen() WITH THIS:
    // Save the instance so main.ts can grab it
    this.hocuspocusServer = server;
    this.logger.log(`Hocuspocus instance created (Waiting for main.ts to attach to port)`);
  }
}