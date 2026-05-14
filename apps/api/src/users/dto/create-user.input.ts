import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  email!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field()
  googleId!: string;
}