import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {UserApiService} from './user-api.service';
import {UserVm} from './models/view-models/user-vm.model';
import {RegisterVm} from './models/view-models/register-vm.model';
import {LoginWithEmailVm, LoginWithIdVm, LoginWithUsernameVm} from './models/view-models/login-vm.model';
import {LoginResponseVm} from './models/view-models/login-response-vm.model';
import {Roles} from '../shared/decorators/roles.decorator';
import {UserRole} from './models/user-role.enum';
import {UseGuards} from '@nestjs/common';
import {GraphQLJwtAuthGuard} from '../shared/guards/graphql/graphql-jwt-auth-guard.service';
import {GraphQLRolesGuard} from '../shared/guards/graphql/graphql-roles-guard.service';
import {GraphQLUserRoleOrSelfGuard} from '../shared/guards/graphql/graphql-user-role-or-self-guard.service';

@Resolver('User')
export class UserResolvers {
  constructor(protected readonly userApiService: UserApiService) {}

  @Mutation('register')
  async register(@Args() vm: RegisterVm): Promise<UserVm> {
    return this.userApiService.register(vm);
  }

  @Mutation('loginWithUsername')
  async loginWithUsername(@Args() vm: LoginWithUsernameVm): Promise<LoginResponseVm> {
    return this.userApiService.loginWithUsername(vm);
  }

  @Mutation('loginWithEmail')
  async loginWithEmail(@Args() vm: LoginWithEmailVm): Promise<LoginResponseVm> {
    return this.userApiService.loginWithEmail(vm);
  }

  @Mutation('loginWithId')
  async loginWithId(@Args() vm: LoginWithIdVm): Promise<LoginResponseVm> {
    return this.userApiService.loginWithId(vm);
  }

  @Query('getUsers')
  @Roles(UserRole.Admin)
  @UseGuards(GraphQLJwtAuthGuard, GraphQLRolesGuard)
  async getUsers(): Promise<UserVm[]> {
    return this.userApiService.getUsers();
  }

  @Query('getUserById')
  @Roles(UserRole.Admin)
  @UseGuards(GraphQLJwtAuthGuard, GraphQLUserRoleOrSelfGuard.forIdFromArgumentKey('id'))
  async getUserById(@Args('id') id: string): Promise<UserVm> {
    return this.userApiService.getUserById(id);
  }

  @Query('getUserByUsername')
  @Roles(UserRole.Admin)
  @UseGuards(GraphQLJwtAuthGuard, GraphQLRolesGuard)
  async getUserByUsername(@Args('username') username: string): Promise<UserVm> {
    return this.userApiService.getUserByUsername(username);
  }

  @Mutation('updateUser')
  @Roles(UserRole.Admin)
  @UseGuards(GraphQLJwtAuthGuard, GraphQLRolesGuard)
  async updateUser(@Args() vm: UserVm): Promise<UserVm> {
    return this.userApiService.updateUser(vm);
  }

  @Mutation('deleteUserById')
  @Roles(UserRole.Admin)
  @UseGuards(GraphQLJwtAuthGuard, GraphQLRolesGuard)
  async deleteUserById(@Args('id') id: string): Promise<UserVm> {
    return this.userApiService.deleteUserById(id);
  }

  @Mutation('resendVerificationEmail')
  @Roles(UserRole.Admin)
  @UseGuards(GraphQLJwtAuthGuard, GraphQLUserRoleOrSelfGuard.forIdFromArgumentKey('id'))
  async resendVerificationEmail(@Args('id') id: string): Promise<void> {
    return this.userApiService.resendVerificationEmail(id);
  }

  @Mutation('resetPassword')
  @UseGuards()
  async resetPassword(@Args('email') email: string): Promise<void> {
    return this.userApiService.resetPassword(email);
  }
}
