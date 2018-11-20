import {Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiImplicitQuery,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger';
import {ApiException} from '../shared/api-exception.model';
import {ToBooleanPipe} from '../shared/pipes/to-boolean.pipe';
import {EnumToArray} from '../shared/utilities/enum-to-array.helper';
import {GetOperationId} from '../shared/utilities/get-operation-id.helper';
import {TodoLevel} from './models/todo-level.enum';
import {Todo} from './models/todo.model';
import {TodoParams} from './models/view-models/todo-params.model';
import {TodoVm} from './models/view-models/todo-vm.model';
import {UserRole} from '../user/models/user-role.enum';
import {HttpRolesGuard} from '../shared/guards/http/http-roles.guard';
import {AuthGuard} from '@nestjs/passport';
import {Roles} from '../shared/decorators/roles.decorator';
import {TodoApiService} from './todo-api.service';

@Controller('todos')
@ApiUseTags(Todo.modelName)
@ApiBearerAuth()
export class TodoController {
  constructor(protected readonly todoApiService: TodoApiService) {}

  @Get()
  @Roles(UserRole.Admin, UserRole.User)
  @UseGuards(<any>AuthGuard('jwt'), HttpRolesGuard)
  @ApiOkResponse({type: TodoVm, isArray: true})
  @ApiBadRequestResponse({type: ApiException})
  @ApiOperation(GetOperationId(Todo.modelName, 'GetAll'))
  @ApiImplicitQuery({
    name: 'level',
    enum: EnumToArray(TodoLevel),
    required: false,
    isArray: true,
  })
  @ApiImplicitQuery({name: 'isCompleted', required: false})
  async get(
    @Query('level') level?: TodoLevel,
    @Query('isCompleted', new ToBooleanPipe()) isCompleted?: boolean,
  ): Promise<TodoVm[]> {
    return this.todoApiService.getTodos(level, isCompleted);
  }

  @Post()
  @Roles(UserRole.Admin, UserRole.User)
  @UseGuards(<any>AuthGuard('jwt'), HttpRolesGuard)
  @ApiCreatedResponse({type: TodoVm})
  @ApiBadRequestResponse({type: ApiException})
  @ApiOperation(GetOperationId(Todo.modelName, 'Create'))
  async create(@Req() request, @Body() params: TodoParams): Promise<TodoVm> {
    const {user} = request;
    const userId = user.id;
    return this.todoApiService.createTodo(userId, params);
  }

  @Put()
  @Roles(UserRole.Admin, UserRole.User)
  @UseGuards(<any>AuthGuard('jwt'), HttpRolesGuard)
  @ApiOkResponse({type: TodoVm})
  @ApiBadRequestResponse({type: ApiException})
  @ApiOperation(GetOperationId(Todo.modelName, 'Update'))
  async update(@Body() vm: TodoVm): Promise<TodoVm> {
    return this.todoApiService.updateTodo(vm);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @UseGuards(<any>AuthGuard('jwt'), HttpRolesGuard)
  @ApiOkResponse({type: TodoVm})
  @ApiBadRequestResponse({type: ApiException})
  @ApiOperation(GetOperationId(Todo.modelName, 'Delete'))
  async delete(@Param('id') id: string): Promise<TodoVm> {
    return this.todoApiService.deleteTodo(id);
  }
}
