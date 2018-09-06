import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InstanceType } from 'typegoose';
import { User } from '../../../user/models/user.model';
import { AbstractRolesGuard } from '../shared/abstract-roles.guard';
import {GqlExecutionContext} from '@nestjs/graphql';

@Injectable()
export class GraphQLRolesGuard extends AbstractRolesGuard {
  protected constructor(protected readonly _reflector: Reflector) {
    super(_reflector);
  }

  getUserFromContext(executionContext: ExecutionContext): InstanceType<User> {
    console.log('GraphQLRolesGuard getUserFromContext');
    const ctx = GqlExecutionContext.create(executionContext);
    const graphqlContext = ctx.getContext();
    return graphqlContext.user;
  }
}
