import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsResolver } from './documents.resolver';
import { DocumentController } from './document.controller';

@Module({
  controllers: [DocumentController],
  providers: [DocumentsResolver, DocumentsService],
})
export class DocumentsModule {}
