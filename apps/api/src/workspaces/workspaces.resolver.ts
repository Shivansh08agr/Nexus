import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { WorkspacesService } from './workspaces.service';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { CreateWorkspaceInput } from './dto/create-workspace.input';
import { InviteUserInput } from './dto/invite-user.input';
import { InviteResult } from './dto/invite-result';
import { UpdateRoleInput } from './dto/update-role.input';

@Resolver(() => Workspace)
export class WorkspacesResolver {
  constructor(private readonly workspacesService: WorkspacesService) {}

  // The endpoint to create a workspace
  @Mutation(() => Workspace)
  createWorkspace(@Args('createWorkspaceInput') createWorkspaceInput: CreateWorkspaceInput) {
    return this.workspacesService.create(createWorkspaceInput);
  }

  // The endpoint to fetch all workspaces for a specific user
  @Query(() => [Workspace], { name: 'workspaces' })
  findAllForUser(@Args('userId', { type: () => String }) userId: string) {
    return this.workspacesService.findAllForUser(userId);
  }

  @Mutation(() => Workspace)
  removeWorkspace(@Args('id', { type: () => String }) id: string) {
    return this.workspacesService.remove(id);
  }

  @Mutation(() => InviteResult)
  inviteUser(@Args('inviteUserInput') inviteUserInput: InviteUserInput) {
    return this.workspacesService.inviteUser(inviteUserInput.email, inviteUserInput.workspaceId);
  }

  @Query(() => [WorkspaceMember], { name: 'workspaceMembers' })
  getWorkspaceMembers(@Args('workspaceId', { type: () => String }) workspaceId: string) {
    return this.workspacesService.getWorkspaceMembers(workspaceId);
  }

  @Mutation(() => WorkspaceMember)
  updateMemberRole(@Args('updateRoleInput') updateRoleInput: UpdateRoleInput) {
    return this.workspacesService.updateMemberRole(updateRoleInput);
  }

  @Query(() => String, { name: 'getMyWorkspaceRole', nullable: true })
  getMyWorkspaceRole(
    @Args('workspaceId', { type: () => String }) workspaceId: string,
    @Args('userId', { type: () => String }) userId: string,
  ) {
    return this.workspacesService.getMyWorkspaceRole(workspaceId, userId);
  }
}