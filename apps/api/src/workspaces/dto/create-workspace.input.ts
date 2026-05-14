import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateWorkspaceInput {
  @Field()
  name!: string;

  @Field()
  userId!: string;

  // These are optional — used to upsert the User row if it doesn't exist yet.
  // This prevents the FK constraint error when a user creates their first workspace.
  @Field({ nullable: true })
  userEmail?: string;

  @Field({ nullable: true })
  userName?: string;

  @Field({ nullable: true })
  userGoogleId?: string;

  @Field({ nullable: true })
  userAvatar?: string;
}