import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './models/user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserApiService } from './user-api.service';
import { UserResolvers } from './user.resolvers';

const SERVICES = [UserService, UserApiService, UserResolvers];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.modelName, schema: User.model.schema },
    ]),
  ],
  providers: [...SERVICES],
  controllers: [UserController],
  exports: [...SERVICES],
})
export class UserModule {}
