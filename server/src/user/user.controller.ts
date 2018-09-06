import {
  Body,
  Controller, Delete, Get, Param,
  Post, Put, Query, UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse, ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger';
import { ApiException } from '../shared/api-exception.model';
import { GetOperationId } from '../shared/utilities/get-operation-id.helper';
import { User } from './models/user.model';
import { LoginResponseVm } from './models/view-models/login-response-vm.model';
import { LoginVm } from './models/view-models/login-vm.model';
import { RegisterVm } from './models/view-models/register-vm.model';
import { UserVm } from './models/view-models/user-vm.model';
import {UserApiService} from './user-api.service';
import {Roles} from '../shared/decorators/roles.decorator';
import {UserRole} from './models/user-role.enum';
import {AuthGuard} from '@nestjs/passport';
import {HttpRolesGuard} from '../shared/guards/http/http-roles.guard';
import {TodoApiService} from '../todo/todo-api.service';
import {TodoVm} from '../todo/models/view-models/todo-vm.model';

@Controller('user')
@ApiUseTags(User.modelName)
export class UserController {
  constructor(
    private readonly userApiService: UserApiService,
    private readonly todoApiService: TodoApiService,
  ) {}

  @Post('register')
  @ApiCreatedResponse({ type: UserVm })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(GetOperationId(User.modelName, 'register'))
  async register(@Body() vm: RegisterVm): Promise<UserVm> {
    return this.userApiService.register(vm);
  }

  @Post('login')
  @ApiCreatedResponse({ type: LoginResponseVm })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(GetOperationId(User.modelName, 'login'))
  async login(@Body() vm: LoginVm): Promise<LoginResponseVm> {
    return this.userApiService.login(vm);
  }

  @Get(':id')
  @Roles(UserRole.Admin)
  @UseGuards(<any>AuthGuard('jwt'), HttpRolesGuard)
  @ApiBearerAuth()
  @ApiOperation(GetOperationId(User.modelName, 'getUserById'))
  async getUserById(@Param('id') id: string): Promise<UserVm> {
    return this.userApiService.getUserById(id);
  }

  @Get(':id/todos')
  @Roles(UserRole.Admin)
  @UseGuards(<any>AuthGuard('jwt'), HttpRolesGuard)
  @ApiBearerAuth()
  @ApiOperation(GetOperationId(User.modelName, 'getUserTodos'))
  async getUserTodos(@Param('id') id: string): Promise<TodoVm[]> {
    return this.todoApiService.getTodosForUser(id);
  }

  @Get('getUsers')
  @Roles(UserRole.Admin)
  @UseGuards(<any>AuthGuard('jwt'), HttpRolesGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserVm })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(GetOperationId(User.modelName, 'getUsers'))
  async getUsers(): Promise<UserVm[]> {
    return this.userApiService.getUsers();
  }

  @Get('getUserByUsername')
  @Roles(UserRole.Admin)
  @UseGuards(<any>AuthGuard('jwt'), HttpRolesGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserVm })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(GetOperationId(User.modelName, 'getUserByUsername'))
  async getUserByUsername(@Query('username') username: string): Promise<UserVm> {
    return this.userApiService.getUserByUsername(username);
  }

  @Put()
  @Roles(UserRole.Admin)
  @UseGuards(<any>AuthGuard('jwt'), HttpRolesGuard)
  @ApiBearerAuth()
  @ApiOperation(GetOperationId(User.modelName, 'updateUser'))
  async updateUser(@Body() vm: UserVm): Promise<UserVm> {
    // TODO: is this checked for malicious stuff?
    return this.userApiService.updateUser(vm);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @UseGuards(<any>AuthGuard('jwt'), HttpRolesGuard)
  @ApiBearerAuth()
  @ApiOperation(GetOperationId(User.modelName, 'deleteUserById'))
  async deleteUserById(@Param('id') id: string): Promise<UserVm> {
    return this.userApiService.deleteUserById(id);
  }
}
