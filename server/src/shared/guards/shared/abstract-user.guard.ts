import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../../user/models/user.model';
import { AbstractTemplateGuard } from './abstract-template.guard';

export abstract class AbstractUserGuard extends AbstractTemplateGuard {
  protected constructor(protected readonly _reflector: Reflector) {
    super();
  }

  protected abstract getUserFromContext(context: ExecutionContext): User;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let canActivate;
    try {
      canActivate = await this.checkCanActivate(context);
    } catch (e) {
      throw new HttpException(`Error inside guard: ${e} (AbstractUserGuard)`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (canActivate) {
      return true;
    }
    throw new HttpException('You do not have permission (AbstractUserGuard)', HttpStatus.UNAUTHORIZED);
  }
}
