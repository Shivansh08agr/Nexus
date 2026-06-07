import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
//users module
@Module({
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
