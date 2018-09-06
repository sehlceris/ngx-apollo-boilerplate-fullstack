import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './models/user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {UserApiService} from './user-api.service';
import {UserResolvers} from './user.resolvers';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.modelName, schema: User.model.schema },
    ]),
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
  ],
})
export class UserModule {}
