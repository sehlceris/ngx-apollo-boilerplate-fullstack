import { ExecutionContext } from '@nestjs/common';
import { User } from '../../../user/models/user.model';
import { GqlExecutionContext } from '@nestjs/graphql';
import { verify } from 'jsonwebtoken';
import { Configuration } from '../../configuration/configuration.enum';
import { ConfigurationService } from '../../configuration/configuration.service';
import { AnyJwtPayload, JwtAuthPayload } from '../../auth/jwt-payload.model';
import { GraphqlContextModel } from './graphql-context.model';

const jwtKey = ConfigurationService.get(Configuration.JWT_SECRET_KEY);

export class GraphQLGuardHelpers {

  static async getJwtPayloadFromAuthenticatedContext(
    executionContext: ExecutionContext
  ): Promise<AnyJwtPayload> {
    const ctx = GqlExecutionContext.create(executionContext);
    const graphqlContext = ctx.getContext();
    return graphqlContext.user;
  }

  static getUserFromAuthenticatedContext(
    executionContext: ExecutionContext
  ): User {
    const ctx = GqlExecutionContext.create(executionContext);
    const graphqlContext = ctx.getContext<GraphqlContextModel>();
    return graphqlContext.user;
  }

  static async getJwtStringFromHeaders(headers): Promise<string> {
    if (!headers || !(headers['authorization'] || headers['Authorization'])) {
      throw new Error('No authorization header provided');
    }

    const authHeader = headers['authorization'] || headers['Authorization'];

    const split = authHeader.split(' ');
    if (
      split &&
      split.length === 2 &&
      (split[0] === 'Bearer' || split[0] === 'bearer')
    ) {
      const jwtStr = split[1];
      return jwtStr;
    }
    throw new Error(
      'Authorization header is not in expected format: Bearer {{jwt}} '
    );
  }

  static async decodeJwtPayload(jwtStr: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      verify(jwtStr, jwtKey, function(err, decoded) {
        if (err) {
          reject(err);
        }
        resolve(decoded);
      });
    });
  }
}
