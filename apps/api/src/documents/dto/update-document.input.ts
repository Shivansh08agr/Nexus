import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateDocumentInput {
  @Field()
  id!: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  content?: string;
}