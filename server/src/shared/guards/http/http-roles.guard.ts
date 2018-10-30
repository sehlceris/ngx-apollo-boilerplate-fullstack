import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../../user/models/user.model';
import { AbstractUserRoleGuard } from '../shared/abstract-user-role.guard';
import { HttpGuardHelpers } from './helpers';

@Injectable()
export class HttpRolesGuard extends AbstractUserRoleGuard {
  protected constructor(protected readonly _reflector: Reflector) {
    super(_reflector);
  }

  getUserFromContext(context: ExecutionContext): User {
    return HttpGuardHelpers.getUserFromAuthenticatedContext(context);
  }
}
