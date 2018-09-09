import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InstanceType } from 'typegoose';
import { User } from '../../../user/models/user.model';

export abstract class AbstractUserGuard implements CanActivate {

  constructor(protected readonly _reflector: Reflector) {}

  protected abstract getUserFromContext(context: ExecutionContext): InstanceType<User>;
  protected abstract async checkCanActivate(context: ExecutionContext): Promise<boolean>;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('AbstractUserGuard canActivate');
    let canActivate;
    try {
      canActivate = await this.checkCanActivate(context);
    }
    catch (e) {
      throw new HttpException(
        `Error inside guard: ${e} (AbstractUserGuard)`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    if (canActivate) {
      return true;
    }
    throw new HttpException(
      'You do not have permission (AbstractUserGuard)',
      HttpStatus.UNAUTHORIZED
    );
  }
}
