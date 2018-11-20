import {ExecutionContext} from '@nestjs/common';
import {User} from '../../../user/models/user.model';
import {GqlExecutionContext} from '@nestjs/graphql';
import {AnyJwtPayload, JwtAuthPayload, JwtSingleUseUserPayload} from '../../auth/jwt-payload.model';
import {GraphqlContextModel} from './graphql-context.model';
import {GuardHelpers} from '../shared/helpers';

export class GraphQLGuardHelpers extends GuardHelpers {
  static async getJwtPayloadFromContext(executionContext: ExecutionContext): Promise<AnyJwtPayload> {
    const ctx = GqlExecutionContext.create(executionContext);
    const graphqlContext = ctx.getContext<GraphqlContextModel>();

    if (!graphqlContext.jwt) {
      const headers = graphqlContext.headers;
      const jwtStr = GraphQLGuardHelpers.getJwtStringFromHeaders(headers);
      const jwtPayload: JwtSingleUseUserPayload = <JwtSingleUseUserPayload>(
        await GraphQLGuardHelpers.verifyJwtPayload(jwtStr)
      );
      graphqlContext.jwt = jwtPayload; //cache jwt
    }
    return {...graphqlContext.jwt};
  }

  static getUserFromAuthenticatedContext(executionContext: ExecutionContext): User {
    const ctx = GqlExecutionContext.create(executionContext);
    const graphqlContext = ctx.getContext<GraphqlContextModel>();
    return graphqlContext.user;
  }
}
