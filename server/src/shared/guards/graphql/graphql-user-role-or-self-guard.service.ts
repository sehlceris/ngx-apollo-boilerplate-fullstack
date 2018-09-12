import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import {InstanceType} from 'typegoose';
import {User} from '../../../user/models/user.model';
import {AbstractRolesOrSelfGuard} from '../shared/abstract-roles-or-self.guard';
import {GraphQLGuardHelpers} from './helpers';
import {Reflector} from '@nestjs/core';

@Injectable()
export abstract class GraphqlUserRoleOrSelfGuard extends AbstractRolesOrSelfGuard {

  private static forIdFromArgumentKeyCache: Map<string, any> =
    new Map<string, any>();

  constructor(protected readonly _reflector: Reflector) {
    super(_reflector);
  }

  static forIdFromArgumentKey(key: string) {
    if (this.forIdFromArgumentKeyCache.has(key)) {
      return this.forIdFromArgumentKeyCache.get(key);
    }
    const c = class GraphqlUserRoleOrSelfFromArgumentKeyGuard extends GraphqlUserRoleOrSelfGuard {
      getTargetUserIdFromContext(executionContext: ExecutionContext): string {
        const args = executionContext.getArgByIndex(1);
        return args[key];
      }
    };
    this.forIdFromArgumentKeyCache.set(key, c);
    return c;
  }

  abstract getTargetUserIdFromContext(executionContext: ExecutionContext): string;

  protected getUserFromContext(executionContext: ExecutionContext): InstanceType<User> {
    return GraphQLGuardHelpers.getUserFromContext(executionContext);
  }
}
