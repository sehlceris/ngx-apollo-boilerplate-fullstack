import {Args, Mutation, Resolver} from '@nestjs/graphql';
import {UserApiService} from './user-api.service';
import {UserVm} from './models/view-models/user-vm.model';
import {RegisterVm} from './models/view-models/register-vm.model';
import {LoginVm} from './models/view-models/login-vm.model';
import {LoginResponseVm} from './models/view-models/login-response-vm.model';
import {Roles} from '../shared/decorators/roles.decorator';
import {UserRole} from './models/user-role.enum';
import {Query, UseGuards} from '@nestjs/common';
import {GraphQLJwtAuthGuard} from '../shared/guards/graphql/graphql-jwt-auth-guard.service';
import {GraphQLRolesGuard} from '../shared/guards/graphql/graphql-roles-guard.service';

@Resolver('User')
export class UserResolvers {
  constructor(
    protected readonly userApiService: UserApiService,
  ) {}

  @Mutation('register')
  async register(
    @Args() vm: RegisterVm,
  ): Promise<UserVm> {
    return this.userApiService.register(vm);
  }

  @Mutation('login')
  async login(
    @Args() vm: LoginVm,
  ): Promise<LoginResponseVm> {
    return this.userApiService.login(vm);
  }

  @Query('getUsers')
  @Roles(UserRole.Admin)
  @UseGuards(GraphQLJwtAuthGuard, GraphQLRolesGuard)
  async getUsers(): Promise<UserVm[]> {
    return this.userApiService.getUsers();
  }

  @Query('getUserById')
  // @Roles(UserRole.Admin)
  // @UseGuards(GraphQLJwtAuthGuard, GraphQLRolesGuard)
  async getUserById(
    @Args('id') id: string
  ): Promise<UserVm> {
    console.log('getUserById resolver', id);
    return this.userApiService.getUserById(id);
  }

  @Query('getUserByUsername')
  @Roles(UserRole.Admin)
  @UseGuards(GraphQLJwtAuthGuard, GraphQLRolesGuard)
  async getUserByUsername(
    @Args() username: string
  ): Promise<UserVm> {
    return this.userApiService.getUserByUsername(username);
  }

  @Mutation('updateUser')
  @Roles(UserRole.Admin)
  @UseGuards(GraphQLJwtAuthGuard, GraphQLRolesGuard)
  async updateUser(
    @Args() vm: UserVm
  ): Promise<UserVm> {
    return this.userApiService.updateUser(vm);
  }

  @Mutation('deleteUserById')
  @Roles(UserRole.Admin)
  @UseGuards(GraphQLJwtAuthGuard, GraphQLRolesGuard)
  async deleteUserById(
    @Args() id: string
  ): Promise<UserVm> {
    return this.userApiService.deleteUserById(id);
  }
}
