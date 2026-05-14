import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateDocumentInput {
  @Field()
  title!: string;

  @Field()
  workspaceId!: string;

  @Field()
  authorId!: string;
}