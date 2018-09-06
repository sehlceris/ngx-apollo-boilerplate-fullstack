import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './models/user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {UserApiService} from './user-api.service';
import {UserResolvers} from './user.resolvers';
import {TodoModule} from '../todo/todo.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.modelName, schema: User.model.schema },
    ]),
    TodoModule,
  ],
  providers: [
    UserService,
    UserApiService,
    UserResolvers,
  ],
  controllers: [
    UserController,
  ],
  exports: [
    UserService,
    UserApiService,
    UserResolvers,
  ],
})
export class UserModule {}
