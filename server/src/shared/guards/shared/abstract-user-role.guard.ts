import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InstanceType } from 'typegoose';
import { UserRole } from '../../../user/models/user-role.enum';
import { User } from '../../../user/models/user.model';
import { AbstractUserGuard } from './abstract-user.guard';

export abstract class AbstractUserRoleGuard extends AbstractUserGuard {
  constructor(protected readonly _reflector: Reflector) {
    super(_reflector);
  }

  protected abstract getUserFromContext(
    context: ExecutionContext
  ): InstanceType<User>;

  protected async checkCanActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const roles = this._reflector.get<UserRole[]>(
      'roles',
      context.getHandler()
    );
    const user: InstanceType<User> = this.getUserFromContext(context);
    const hasRole = () =>
      roles && roles.length && roles.indexOf(user.role) >= 0;
    return user && user.role && hasRole();
  }
}
