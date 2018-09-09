import {
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InstanceType } from 'typegoose';
import { UserRole } from '../../../user/models/user-role.enum';
import { User } from '../../../user/models/user.model';
import {AbstractUserGuard} from './abstract-user.guard';

export abstract class AbstractUserRoleOrSelfGuard extends AbstractUserGuard {

  constructor(protected readonly _reflector: Reflector) {
    super(_reflector);
  }

  protected abstract getUserFromContext(context: ExecutionContext): InstanceType<User>;

  protected abstract getTargetUserIdFromContext(context: ExecutionContext): string;

  protected async checkCanActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this._reflector.get<UserRole[]>(
      'roles',
      context.getHandler()
    );
    const user: InstanceType<User> = this.getUserFromContext(context);
    const targetUserId = this.getTargetUserIdFromContext(context);
    const hasRole = () => roles && roles.length && roles.indexOf(user.role) >= 0;
    const targetsSelf = () => user.id && targetUserId && user.id === targetUserId;
    return (user && user.role && (hasRole() || targetsSelf()));
  }
}
