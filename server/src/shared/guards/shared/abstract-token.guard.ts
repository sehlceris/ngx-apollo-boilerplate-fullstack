import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BoundLogger, LogService } from "../../utilities/log.service";
import { AbstractTemplateGuard } from "./abstract-template.guard";
import { JwtPayloadType, JwtSingleUseUserPayload } from '../../auth/jwt-payload.model';
import { RedisService } from '../../utilities/redis.service';

export abstract class AbstractTokenGuard extends AbstractTemplateGuard {

  private log: BoundLogger = this.logService.bindToNamespace(AbstractTokenGuard.name);

  protected constructor(
    protected readonly _reflector: Reflector,
    protected readonly memoryCacheService: RedisService,
    protected logService: LogService,
  ) {
    super();
  }

  protected abstract async getJwtPayloadFromContext(
    context: ExecutionContext
  ): Promise<JwtSingleUseUserPayload>;

  protected async checkCanActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const jwtPayloadType: JwtPayloadType = this._reflector.get<JwtPayloadType>(
      'jwtPayloadType',
      context.getHandler()
    );
    const jwtPayload: JwtSingleUseUserPayload = await this.getJwtPayloadFromContext(context);
    this.log.debug(`checkCanActivate with JWT payload type: ${jwtPayloadType} vs ${jwtPayload.type}`);
    const isSameType = (!jwtPayloadType || jwtPayload && jwtPayload.type && jwtPayload.type === jwtPayloadType);
    if (!isSameType || !jwtPayload.jti) {
      return false;
    }
    return this.memoryCacheService.hasJti(jwtPayload.jti);
  }
}
