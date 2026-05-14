import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class WorkspaceMember {
  @Field(() => ID)
  id: string;

  @Field()
  role: string;

  @Field()
  joinedAt: Date;

  @Field(() => User)
  user: User;
}
