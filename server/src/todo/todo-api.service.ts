import { TodoService } from './todo.service';
import { isArray, map } from 'lodash';
import { TodoVm } from './models/view-models/todo-vm.model';
import { TodoLevel } from './models/todo-level.enum';
import { TodoParams } from './models/view-models/todo-params.model';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class TodoApiService {
  constructor(protected readonly todoService: TodoService) {}

  async getTodosForUser(ownerId: string): Promise<TodoVm[]> {
    const todos = await this.todoService.findAll({ ownerId });
    return this.todoService.map<TodoVm[]>(map(todos, (todo) => todo.toJSON()));
  }

  async getTodos(level?: TodoLevel, isCompleted?: boolean): Promise<TodoVm[]> {
    let filter = {};

    if (level) {
      filter['level'] = { $in: isArray(level) ? [...level] : [level] };
    }

    if (typeof isCompleted === 'boolean') {
      if (filter['level']) {
        filter = { $and: [{ level: filter['level'] }, { isCompleted }] };
      } else {
        filter['isCompleted'] = isCompleted;
      }
    }

    const todos = await this.todoService.findAll(filter);
    return this.todoService.map<TodoVm[]>(map(todos, (todo) => todo.toJSON()));
  }

  async createTodo(ownerId: string, params: TodoParams): Promise<TodoVm> {
    const newTodo = await this.todoService.createTodo(ownerId, params);
    const mappedTodo = this.todoService.map<TodoVm>(newTodo);
    return mappedTodo;
  }

  async updateTodo(vm: TodoVm): Promise<TodoVm> {
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

  async deleteTodo(id: string): Promise<TodoVm> {
    const deleted = await this.todoService.delete(id);
    if (!deleted) {
      throw new HttpException(`${id} Not found`, HttpStatus.BAD_REQUEST);
    }
    return this.todoService.map<TodoVm>(deleted.toJSON());
  }
}
