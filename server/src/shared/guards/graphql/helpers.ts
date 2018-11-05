import { ExecutionContext } from '@nestjs/common';
import { User } from '../../../user/models/user.model';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AnyJwtPayload, JwtAuthPayload } from '../../auth/jwt-payload.model';
import { GraphqlContextModel } from './graphql-context.model';
import { GuardHelpers } from '../shared/helpers';

export class GraphQLGuardHelpers extends GuardHelpers {
  static getJwtPayloadFromAuthenticatedContext(executionContext: ExecutionContext): AnyJwtPayload {
    const ctx = GqlExecutionContext.create(executionContext);
    const graphqlContext = ctx.getContext<GraphqlContextModel>();
    return graphqlContext.jwt;
  }

  static getUserFromAuthenticatedContext(executionContext: ExecutionContext): User {
    const ctx = GqlExecutionContext.create(executionContext);
    const graphqlContext = ctx.getContext<GraphqlContextModel>();
    return graphqlContext.user;
  }
}
