import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {Token} from './models/token.model';
import {TokenController} from './token.controller';
import {TokenService} from './token.service';
import {TokenApiService} from './token-api.service';
import {TokenResolvers} from './token.resolvers';

const SERVICES = [TokenService, TokenApiService, TokenResolvers];

@Module({
  imports: [MongooseModule.forFeature([{name: Token.modelName, schema: Token.model.schema}])],
  providers: [...SERVICES],
  controllers: [TokenController],
  exports: [...SERVICES],
})
export class TokenModule {}
