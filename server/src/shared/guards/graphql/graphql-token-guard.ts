import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../../auth/auth.service';
import { JwtSingleUseUserPayload } from '../../auth/jwt-payload.model';
import { LogService } from '../../utilities/log.service';
import { RedisService } from '../../utilities/redis.service';
import { AbstractTokenGuard } from '../shared/abstract-token.guard';
import { GraphqlContextModel } from './graphql-context.model';
import { GraphQLGuardHelpers } from './helpers';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GraphqlTokenGuard extends AbstractTokenGuard {
  constructor(
    protected readonly _reflector: Reflector,
    protected readonly memoryCacheService: RedisService,
    protected readonly authService: AuthService,
    protected readonly logService: LogService,
  ) {
    super(_reflector, memoryCacheService, logService);
  }

  protected async getJwtPayloadFromContext(executionContext: ExecutionContext): Promise<JwtSingleUseUserPayload> {
    const ctx = GqlExecutionContext.create(executionContext);
    const graphqlContext = ctx.getContext<GraphqlContextModel>();
    const headers = graphqlContext.headers;
    const jwtStr = GraphQLGuardHelpers.getJwtStringFromHeaders(headers);
    const jwtPayload: JwtSingleUseUserPayload = <JwtSingleUseUserPayload>(
      await GraphQLGuardHelpers.verifyJwtPayload(jwtStr)
    );
    graphqlContext.jwt = jwtPayload;
    return jwtPayload;
  }
}
