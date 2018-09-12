import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { InstanceType } from 'typegoose';
import { User } from '../../../user/models/user.model';
import {AbstractRolesOrSelfGuard} from '../shared/abstract-roles-or-self.guard';
import {GraphQLGuardHelpers} from './helpers';
import {Reflector} from '@nestjs/core';

@Injectable()
export abstract class GraphqlUserRoleOrSelfGuard extends AbstractRolesOrSelfGuard {

  constructor(protected readonly _reflector: Reflector) {
    super(_reflector);
  }

  static forArgumentKey(key: string) {
    return class GraphqlUserRoleOrSelfFromArgumentKeyGuard extends GraphqlUserRoleOrSelfGuard {
      getTargetUserIdFromContext(executionContext: ExecutionContext): string {
        const args = executionContext.getArgByIndex(1);
        return args[key];
      }
    };
  }

  abstract getTargetUserIdFromContext(executionContext: ExecutionContext): string;

  protected getUserFromContext(executionContext: ExecutionContext): InstanceType<User> {
    return GraphQLGuardHelpers.getUserFromContext(executionContext);
  }
}
