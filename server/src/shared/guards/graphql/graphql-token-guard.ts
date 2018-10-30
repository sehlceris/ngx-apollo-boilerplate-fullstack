import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtSingleUseUserPayload } from '../../auth/jwt-payload.model';
import { MemoryCacheService } from '../../utilities/memory-cache.service';
import { AbstractTokenGuard } from '../shared/abstract-token.guard';
import { GraphQLGuardHelpers } from './helpers';

@Injectable()
export class GraphqlTokenGuard extends AbstractTokenGuard {

  constructor(
    protected readonly _reflector: Reflector,
    protected readonly memoryCacheService: MemoryCacheService,
  ) {
    super(
      _reflector,
      memoryCacheService,
    );
  }

  protected async getJwtPayloadFromContext(
    executionContext: ExecutionContext
  ): JwtSingleUseUserPayload {
    return GraphQLGuardHelpers.getJwtPayloadFromAuthenticatedContext(executionContext);
  }
}
