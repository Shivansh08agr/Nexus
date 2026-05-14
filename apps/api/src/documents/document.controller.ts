import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 

@Controller('documents')
export class DocumentController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('create')
  async createDocument(@Body() body: { workspaceId: string; authorId: string }) {
    try {
      if (!body.workspaceId || !body.authorId) {
        throw new Error('Missing required relations');
      }

      const newDoc = await this.prisma.document.create({
        data: {
          title: 'Untitled Document',
          content: '{}', 
          // Link the document to the existing workspace and author
          workspace: {
            connect: { id: body.workspaceId }
          },
          author: {
            connect: { id: body.authorId }
          }
        },
      });

      return { documentId: newDoc.id };
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to create secure document', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}