import {ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {User} from '../../../user/models/user.model';
import {AbstractUserRoleGuard} from '../shared/abstract-user-role.guard';
import {GraphQLGuardHelpers} from './helpers';

@Injectable()
export class GraphQLRolesGuard extends AbstractUserRoleGuard {
  protected constructor(protected readonly _reflector: Reflector) {
    super(_reflector);
  }

  protected getUserFromContext(executionContext: ExecutionContext): User {
    return GraphQLGuardHelpers.getUserFromAuthenticatedContext(executionContext);
  }
}
