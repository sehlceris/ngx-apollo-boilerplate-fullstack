import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InstanceType } from 'typegoose';
import { User } from '../../../user/models/user.model';
import { AbstractUserRoleGuard } from '../shared/abstract-user-role.guard';
import {GqlExecutionContext} from '@nestjs/graphql';

@Injectable()
export class GraphQLRolesGuard extends AbstractUserRoleGuard {
  protected constructor(protected readonly _reflector: Reflector) {
    super(_reflector);
  }

  getUserFromContext(executionContext: ExecutionContext): InstanceType<User> {
    const ctx = GqlExecutionContext.create(executionContext);
    const graphqlContext = ctx.getContext();
    return graphqlContext.user;
  }
}
