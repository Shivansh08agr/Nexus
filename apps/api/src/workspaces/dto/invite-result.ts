import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class InviteResult {
  @Field()
  status: string;

  @Field()
  email: string;
}
