import {
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { isArray, map } from 'lodash';
import { ToBooleanPipe } from '../shared/pipes/to-boolean.pipe';
import { TodoLevel } from './models/todo-level.enum';
import { Todo } from './models/todo.model';
import { TodoParams } from './models/view-models/todo-params.model';
import { TodoVm } from './models/view-models/todo-vm.model';
import { TodoService } from './todo.service';
import {UserRole} from '../user/models/user-role.enum';
import {Roles} from '../shared/decorators/roles.decorator';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import {PubSub} from 'graphql-subscriptions';
import {GraphQLJwtAuthGuard} from '../shared/guards/graphql/graphql-jwt-auth-guard.service';
import {GraphQLRolesGuard} from '../shared/guards/graphql/graphql-roles-guard.service';

const pubSub = new PubSub();

@Resolver('Todo')
export class TodoResolvers {
  constructor(private readonly todoService: TodoService) {}

  @Query()
  @Roles(UserRole.Admin, UserRole.User)
  @UseGuards(GraphQLJwtAuthGuard, GraphQLRolesGuard)
  async getTodos(
    @Args('level') level?: TodoLevel,
    @Args('isCompleted', new ToBooleanPipe()) isCompleted?: boolean
  ): Promise<TodoVm[]> {
    let filter = {};

    if (level) {
      filter['level'] = { $in: isArray(level) ? [...level] : [level] };
    }

    if (typeof(isCompleted) === 'boolean') {
      if (filter['level']) {
        filter = { $and: [{ level: filter['level'] }, { isCompleted }] };
      } else {
        filter['isCompleted'] = isCompleted;
      }
    }

    const todos = await this.todoService.findAll(filter);
    return this.todoService.map<TodoVm[]>(
      map(todos, (todo) => todo.toJSON())
    );
  }

  @Mutation('createTodo')
  @Roles(UserRole.Admin, UserRole.User)
  // @UseGuards(<any>AuthGuard('jwt'), RolesGuard)
  async createTodo(
    @Args() args: TodoParams
  ): Promise<TodoVm> {
    const newTodo = await this.todoService.createTodo(args);
    const mappedTodo = this.todoService.map<TodoVm>(newTodo);
    pubSub.publish('todoCreated', { todoCreated: mappedTodo });
    return mappedTodo;
  }

  @Mutation('updateTodo')
  @Roles(UserRole.Admin, UserRole.User)
  // @UseGuards(<any>AuthGuard('jwt'), RolesGuard)
  async update(@Args() vm: TodoVm): Promise<TodoVm> {
    const { id, content, level, isCompleted } = vm;

    if (!vm || !id) {
      throw new HttpException('Missing parameters', HttpStatus.BAD_REQUEST);
    }

    const exist = await this.todoService.findById(id);

    if (!exist) {
      throw new HttpException(`${id} Not found`, HttpStatus.NOT_FOUND);
    }

    if (exist.isCompleted) {
      throw new HttpException('Already completed', HttpStatus.BAD_REQUEST);
    }

    exist.content = content;
    exist.isCompleted = isCompleted;
    exist.level = level;

    const updated = await this.todoService.update(id, exist);
    return this.todoService.map<TodoVm>(updated.toJSON());
  }

  @Mutation('deleteTodo')
  @Roles(UserRole.Admin, UserRole.User)
  // @UseGuards(<any>AuthGuard('jwt'), RolesGuard)
  async delete(@Args('id') id: string): Promise<TodoVm> {
    const deleted = await this.todoService.delete(id);
    return this.todoService.map<TodoVm>(deleted.toJSON());
  }

  @Subscription('todoCreated')
  todoCreated() {
    return {
      subscribe: () => pubSub.asyncIterator('todoCreated'),
    };
  }
}
