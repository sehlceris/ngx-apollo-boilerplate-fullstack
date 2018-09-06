import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InstanceType } from 'typegoose';
import { UserRole } from '../../../user/models/user-role.enum';
import { User } from '../../../user/models/user.model';

export abstract class AbstractRolesGuard implements CanActivate {

  constructor(protected readonly _reflector: Reflector) {}

  abstract getUserFromContext(context: ExecutionContext): InstanceType<User>;

  canActivate(context: ExecutionContext): boolean {
    const roles = this._reflector.get<UserRole[]>(
      'roles',
      context.getHandler()
    );

    if (!roles || roles.length === 0) {
      return true;
    }

    const user: InstanceType<User> = this.getUserFromContext(context);

    const hasRole = () => roles.indexOf(user.role) >= 0;

    if (user && user.role && hasRole()) {
      return true;
    }

    throw new HttpException(
      'You do not have permission (Roles)',
      HttpStatus.UNAUTHORIZED
    );
  }
}
