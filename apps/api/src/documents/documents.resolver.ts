import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DocumentsService } from './documents.service';
import { Document } from './entities/document.entity';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';

@Resolver(() => Document)
export class DocumentsResolver {
  constructor(private readonly documentsService: DocumentsService) {}

  @Mutation(() => Document)
  createDocument(@Args('createDocumentInput') createDocumentInput: CreateDocumentInput) {
    return this.documentsService.create(createDocumentInput);
  }

  @Query(() => [Document], { name: 'workspaceDocuments' })
  findAllByWorkspace(@Args('workspaceId', { type: () => String }) workspaceId: string) {
    return this.documentsService.findAllByWorkspace(workspaceId);
  }

  @Query(() => Document, { name: 'document' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.documentsService.findOne(id);
  }

  @Mutation(() => Document)
  updateDocument(@Args('updateDocumentInput') updateDocumentInput: UpdateDocumentInput) {
    return this.documentsService.update(updateDocumentInput.id, updateDocumentInput);
  }

  @Mutation(() => Document)
  removeDocument(@Args('id', { type: () => String }) id: string) {
    return this.documentsService.remove(id);
  }
}