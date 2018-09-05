import {
  UseGuards,
} from '@nestjs/common';
import {ToBooleanPipe} from '../shared/pipes/to-boolean.pipe';
import {TodoLevel} from './models/todo-level.enum';
import {Todo} from './models/todo.model';
import {TodoParams} from './models/view-models/todo-params.model';
import {TodoVm} from './models/view-models/todo-vm.model';
import {TodoService} from './todo.service';
import {UserRole} from '../user/models/user-role.enum';
import {Roles} from '../shared/decorators/roles.decorator';
import {Args, Mutation, Query, Resolver, Subscription} from '@nestjs/graphql';
import {PubSub} from 'graphql-subscriptions';
import {GraphQLJwtAuthGuard} from '../shared/guards/graphql/graphql-jwt-auth-guard.service';
import {GraphQLRolesGuard} from '../shared/guards/graphql/graphql-roles-guard.service';
import {TodoApiBase} from './todo.api.base';

const pubSub = new PubSub();

@Resolver('Todo')
export class TodoResolvers extends TodoApiBase {
  constructor(
    protected readonly todoService: TodoService,
  ) {
    super(todoService);
  }

  @Query()
  @Roles(UserRole.Admin, UserRole.User)
  @UseGuards(GraphQLJwtAuthGuard, GraphQLRolesGuard)
  async getTodos(
    @Args('level') level?: TodoLevel,
    @Args('isCompleted', new ToBooleanPipe()) isCompleted?: boolean,
  ): Promise<TodoVm[]> {
    return super.getTodos(level, isCompleted);
  }

  @Mutation('createTodo')
  @Roles(UserRole.Admin, UserRole.User)
  @UseGuards(GraphQLJwtAuthGuard, GraphQLRolesGuard)
  async createTodo(
    @Args() args: TodoParams,
  ): Promise<TodoVm> {
    const todoPromise = super.createTodo(args);
    todoPromise
      .then((mappedTodo) => {
        // TODO: this publish must also somehow happen upon creation from the REST endpoints
        pubSub.publish('todoCreated', {todoCreated: mappedTodo});
      });
    return todoPromise;
  }

  @Mutation('updateTodo')
  @Roles(UserRole.Admin, UserRole.User)
  @UseGuards(GraphQLJwtAuthGuard, GraphQLRolesGuard)
  async update(@Args() vm: TodoVm): Promise<TodoVm> {
    return super.updateTodo(vm);
  }

  @Mutation('deleteTodo')
  @Roles(UserRole.Admin, UserRole.User)
  @UseGuards(GraphQLJwtAuthGuard, GraphQLRolesGuard)
  async delete(@Args('id') id: string): Promise<TodoVm> {
    return super.deleteTodo(id);
  }

  @Subscription('todoCreated')
  // TODO: guards???
  todoCreated() {
    return {
      subscribe: () => pubSub.asyncIterator('todoCreated'),
    };
  }
}
