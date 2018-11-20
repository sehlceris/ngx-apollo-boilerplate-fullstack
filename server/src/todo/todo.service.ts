import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {ModelType} from 'typegoose';
import {BaseService} from '../shared/base.service';
import {MapperService} from '../shared/mapper/mapper.service';
import {Todo, TodoModel} from './models/todo.model';
import {TodoParams} from './models/view-models/todo-params.model';

@Injectable()
export class TodoService extends BaseService<Todo> {
  constructor(
    @InjectModel(Todo.modelName) private readonly todoModel: ModelType<Todo>,
    private readonly mapperService: MapperService,
  ) {
    super();
    this._model = todoModel;
    this._mapper = mapperService.mapper;
  }

  async createTodo(ownerId: string, params: TodoParams): Promise<Todo> {
    const {content, level} = params;

    if (!ownerId) {
      throw new BadRequestException('No ownerId provided');
    }

    const newTodo = new TodoModel();

    newTodo.ownerId = ownerId;
    newTodo.content = content;

    if (level) {
      newTodo.level = level;
    }

    try {
      const result = await this.create(newTodo);
      return result.toJSON() as Todo;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
