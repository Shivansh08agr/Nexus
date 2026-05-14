import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class InviteUserInput {
  @Field()
  email: string;

  @Field()
  workspaceId: string;

  @Field({ nullable: true })
  documentId?: string;
}
