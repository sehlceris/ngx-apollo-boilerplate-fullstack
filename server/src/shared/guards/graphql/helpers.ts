import {ExecutionContext} from '@nestjs/common';
import {InstanceType} from 'typegoose';
import {User} from '../../../user/models/user.model';
import {GqlExecutionContext} from '@nestjs/graphql';

export class GraphQLGuardHelpers {
  static getUserFromContext(executionContext: ExecutionContext): InstanceType<User> {
    const ctx = GqlExecutionContext.create(executionContext);
    const graphqlContext = ctx.getContext();
    return graphqlContext.user;
  }
}
