import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // THE FIX: GraphQL requires at least one Query to boot up successfully.
  // We will replace this with a real "getUserById" query later.
  @Query(() => String)
  healthCheck(): string {
    return 'GraphQL API is fully awake and running!';
  }

  // Our Auth Bridge Mutation
  @Mutation(() => User, { name: 'syncUser' })
  async syncUser(
    @Args('email') email: string,
    @Args('name') name: string,
    @Args('googleId') googleId: string,
    @Args('avatar', { nullable: true }) avatar?: string,
  ): Promise<User> {
    const input: CreateUserInput = { email, name, googleId, avatar };
    return this.usersService.syncUser(input);
  }
}