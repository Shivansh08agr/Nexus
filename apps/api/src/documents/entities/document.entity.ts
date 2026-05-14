import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Document {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field({ nullable: true })
  content?: string; // Text editor content (can be empty initially)

  @Field()
  workspaceId!: string;

  @Field()
  authorId!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}