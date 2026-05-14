import { Injectable } from '@nestjs/common';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDocumentInput: CreateDocumentInput) {
    return this.prisma.document.create({
      data: {
        title: createDocumentInput.title,
        workspaceId: createDocumentInput.workspaceId,
        authorId: createDocumentInput.authorId,
        content: '', // Start with an empty document
      },
    });
  }

  async findAllByWorkspace(workspaceId: string) {
    return this.prisma.document.findMany({
      where: {
        workspaceId: workspaceId,
      },
      orderBy: {
        updatedAt: 'desc', // Show newest documents at the top
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.document.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateDocumentInput: UpdateDocumentInput) {
    return this.prisma.document.update({
      where: { id },
      data: {
        title: updateDocumentInput.title,
        content: updateDocumentInput.content,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.document.delete({
      where: { id },
    });
  }
}