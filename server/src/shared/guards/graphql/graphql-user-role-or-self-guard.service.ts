import {ExecutionContext, Injectable} from '@nestjs/common';
import {User} from '../../../user/models/user.model';
import {AbstractRolesOrSelfGuard} from '../shared/abstract-roles-or-self.guard';
import {GraphQLGuardHelpers} from './helpers';
import {Reflector} from '@nestjs/core';

@Injectable()
export abstract class GraphQLUserRoleOrSelfGuard extends AbstractRolesOrSelfGuard {
  private static forIdFromArgumentKeyCache: Map<string, any> = new Map<string, any>();

  constructor(protected readonly _reflector: Reflector) {
    super(_reflector);
  }

  static forIdFromArgumentKey(key: string) {
    if (this.forIdFromArgumentKeyCache.has(key)) {
      return this.forIdFromArgumentKeyCache.get(key);
    }
    const c = class GraphqlUserRoleOrSelfFromArgumentKeyGuard extends GraphQLUserRoleOrSelfGuard {
      getTargetUserIdFromContext(executionContext: ExecutionContext): string {
        const args = executionContext.getArgByIndex(1);
        return args[key];
      }
    };
    this.forIdFromArgumentKeyCache.set(key, c);
    return c;
  }

  abstract getTargetUserIdFromContext(executionContext: ExecutionContext): string;

  protected getUserFromContext(executionContext: ExecutionContext): User {
    return GraphQLGuardHelpers.getUserFromAuthenticatedContext(executionContext);
  }
}
