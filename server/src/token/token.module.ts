import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Token } from './models/token.model';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { TokenApiService } from './token-api.service';
import { TokenResolvers } from './token.resolvers';
import { TodoModule } from '../todo/todo.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Token.modelName, schema: Token.model.schema },
    ]),
    TodoModule,
  ],
  providers: [
    TokenService,
    TokenApiService,
    TokenResolvers,
  ],
  controllers: [TokenController],
  exports: [TokenService, TokenApiService, TokenResolvers],
})
export class TokenModule {}
