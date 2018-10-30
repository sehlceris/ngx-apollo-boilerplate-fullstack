import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Configuration } from '../../configuration/configuration.enum';
import { ConfigurationService } from '../../configuration/configuration.service';
import { AnyJwtPayload, AnyJwtUserPayload, JwtAuthPayload } from '../../auth/jwt-payload.model';
import { AuthService } from '../../auth/auth.service';
import { GraphQLGuardHelpers } from './helpers';

@Injectable()
export class GraphQLJwtAuthGuard implements CanActivate {
  protected jwtKey: string;

  constructor(
    private readonly _reflector: Reflector,
    private readonly _configurationService: ConfigurationService,
    private readonly authService: AuthService
  ) {
    this.jwtKey = _configurationService.get(Configuration.JWT_SECRET_KEY);
  }

  async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(executionContext);
    const graphqlContext = ctx.getContext();
    const headers = graphqlContext.headers;

    try {
      const jwtStr = GraphQLGuardHelpers.getJwtStringFromHeaders(headers);
      const decodedJwt: AnyJwtUserPayload = await GraphQLGuardHelpers.decodeJwtPayload(jwtStr);
      const user = await this.authService.validateUserAuthentication(decodedJwt);
      graphqlContext.user = user;
      graphqlContext.jwt = decodedJwt;
      return true;
    } catch (e) {
      throw new HttpException(
        `Failed to authenticate: ${e} (GraphqlJwtAuthGuard)`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    throw new HttpException(
      'You do not have permission (GraphQLJwtAuthGuard)',
      HttpStatus.UNAUTHORIZED
    );
  }
}
