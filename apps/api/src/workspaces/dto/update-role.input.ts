import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateRoleInput {
  @Field()
  workspaceId: string;

  @Field()
  userId: string;

  @Field()
  role: string;
}
