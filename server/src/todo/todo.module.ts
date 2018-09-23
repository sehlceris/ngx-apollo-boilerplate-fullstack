import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo } from './models/todo.model';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TodoResolvers } from './todo.resolvers';
import { TodoApiService } from './todo-api.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Todo.modelName, schema: Todo.model.schema },
    ]),
  ],
  controllers: [TodoController],
  providers: [TodoService, TodoApiService, TodoResolvers],
  exports: [TodoService, TodoApiService],
})
export class TodoModule {}
