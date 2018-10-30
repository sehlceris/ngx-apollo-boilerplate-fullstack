import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbstractUserGuard } from './abstract-user.guard';
import { JwtPayloadType, JwtSingleUseUserPayload } from '../../auth/jwt-payload.model';
import { MemoryCacheService } from '../../utilities/memory-cache.service';

export abstract class AbstractTokenGuard extends AbstractUserGuard {
  constructor(
    protected readonly _reflector: Reflector,
    protected readonly memoryCacheService: MemoryCacheService,
  ) {
    super(_reflector);
  }

  protected abstract async getJwtPayloadFromContext(
    context: ExecutionContext
  ): JwtSingleUseUserPayload;

  protected async checkCanActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const jwtPayloadType: JwtPayloadType = this._reflector.get<JwtPayloadType>(
      'jwtPayloadType',
      context.getHandler()
    );
    const jwtPayload: JwtSingleUseUserPayload = await this.getJwtPayloadFromContext(context);
    const isSameType = jwtPayload && jwtPayload.type && jwtPayload.type === jwtPayloadType;
    if (!isSameType || !jwtPayload.jti) {
      return false;
    }
    return this.memoryCacheService.hasJti(jwtPayloadType, jwtPayload.jti);
  }
}
