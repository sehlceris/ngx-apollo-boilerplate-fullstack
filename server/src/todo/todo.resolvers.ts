import { UseGuards } from '@nestjs/common';
import { ToBooleanPipe } from '../shared/pipes/to-boolean.pipe';
import { TodoLevel } from './models/todo-level.enum';
import { Todo } from './models/todo.model';
import { TodoParams } from './models/view-models/todo-params.model';
import { TodoVm } from './models/view-models/todo-vm.model';
import { UserRole } from '../user/models/user-role.enum';
import { Roles } from '../shared/decorators/roles.decorator';
import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphQLJwtAuthGuard } from '../shared/guards/graphql/graphql-jwt-auth-guard.service';
import { GraphQLRolesGuard } from '../shared/guards/graphql/graphql-roles-guard.service';
import { TodoApiService } from './todo-api.service';

const pubSub = new PubSub();

@Resolver('Todo')
export class TodoResolvers {
  constructor(protected readonly todoApiService: TodoApiService) {}

  @Query('getTodos')
  @Roles(UserRole.Admin)
  @UseGuards(GraphQLJwtAuthGuard, GraphQLRolesGuard)
  async getTodos(
    @Args('level') level?: TodoLevel,
    @Args('isCompleted', new ToBooleanPipe()) isCompleted?: boolean
  ): Promise<TodoVm[]> {
    return this.todoApiService.getTodos(level, isCompleted);
  }

  // @Query('getTodosForUser')
  // @Roles(UserRole.Admin, UserRole.User)
  // @UseGuards(GraphQLJwtAuthGuard, GraphQLRolesGuard)
  // async getTodosForUser(
  //   @Args('userId') userId: string,
  //   @Args('level') level?: TodoLevel,
  //   @Args('isCompleted', new ToBooleanPipe()) isCompleted?: boolean
  // ): Promise<TodoVm[]> {
  //   return this.todoApiService.getTodosForUser(ownerId);
  // }

  @Mutation('createTodo')
  @Roles(UserRole.Admin, UserRole.User)
  @UseGuards(GraphQLJwtAuthGuard, GraphQLRolesGuard)
  async createTodo(
    @Context() context: any,
    @Args() params: TodoParams
  ): Promise<TodoVm> {
    const { user } = context;
    const userId = user.id;
    const todoPromise = this.todoApiService.createTodo(userId, params);
    todoPromise.then((mappedTodo) => {
      // TODO: this publish must also somehow happen upon creation from the REST endpoints
      pubSub.publish('todoCreated', { todoCreated: mappedTodo });
    });
    return todoPromise;
  }

  @Mutation('updateTodo')
  @Roles(UserRole.Admin, UserRole.User)
  @UseGuards(GraphQLJwtAuthGuard, GraphQLRolesGuard)
  async update(@Args() vm: TodoVm): Promise<TodoVm> {
    return this.todoApiService.updateTodo(vm);
  }

  @Mutation('deleteTodo')
  @Roles(UserRole.Admin, UserRole.User)
  @UseGuards(GraphQLJwtAuthGuard, GraphQLRolesGuard)
  async delete(@Args('id') id: string): Promise<TodoVm> {
    return this.todoApiService.deleteTodo(id);
  }

  @Subscription('todoCreated')
  // TODO: guards???
  todoCreated() {
    return {
      subscribe: () => pubSub.asyncIterator('todoCreated'),
    };
  }
}
