import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { InstanceType } from 'typegoose';
import { User } from '../../../user/models/user.model';
import {AbstractUserRoleOrSelfGuard} from '../shared/abstract-user-role-or-self.guard';
import {GraphQLGuardHelpers} from './helpers';
import {Reflector} from '@nestjs/core';

@Injectable()
export abstract class GraphqlUserRoleOrSelfGuard extends AbstractUserRoleOrSelfGuard {

  constructor(protected readonly _reflector: Reflector) {
    super(_reflector);
  }

  static forArgumentKey(key: string) {
    const newClass = class extends GraphqlUserRoleOrSelfGuard {
      getTargetUserIdFromContext(executionContext: ExecutionContext): string {
        const args = executionContext.getArgByIndex(1);
        return args[key];
      }
    };
    return newClass;
  }

  abstract getTargetUserIdFromContext(executionContext: ExecutionContext): string;

  protected getUserFromContext(executionContext: ExecutionContext): InstanceType<User> {
    return GraphQLGuardHelpers.getUserFromContext(executionContext);
  }
}
