import {ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {AuthService} from '../../auth/auth.service';
import {JwtSingleUseUserPayload} from '../../auth/jwt-payload.model';
import {LogService} from '../../utilities/log.service';
import {MemoryCacheService} from '../../utilities/memory-cache.service';
import {AbstractTokenGuard} from '../shared/abstract-token.guard';
import {HttpGuardHelpers} from './helpers';

@Injectable()
export class HttpTokenGuard extends AbstractTokenGuard {
  constructor(
    protected readonly _reflector: Reflector,
    protected readonly memoryCacheService: MemoryCacheService,
    protected readonly authService: AuthService,
    protected readonly logService: LogService,
  ) {
    super(_reflector, memoryCacheService, logService);
  }

  protected async getJwtPayloadFromContext(executionContext: ExecutionContext): Promise<JwtSingleUseUserPayload> {
    return <Promise<JwtSingleUseUserPayload>>HttpGuardHelpers.getJwtPayloadFromExecutionContext(executionContext);
  }
}
