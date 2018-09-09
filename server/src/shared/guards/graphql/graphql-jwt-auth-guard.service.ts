import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { verify } from 'jsonwebtoken';
import {Configuration} from '../../configuration/configuration.enum';
import {ConfigurationService} from '../../configuration/configuration.service';
import {JwtPayload} from '../../auth/jwt-payload.model';
import {AuthService} from '../../auth/auth.service';

@Injectable()
export class GraphQLJwtAuthGuard implements CanActivate {

  protected jwtKey: string;

  constructor(
    private readonly _reflector: Reflector,
    private readonly _configurationService: ConfigurationService,
    private readonly authService: AuthService,
  ) {
    this.jwtKey = _configurationService.get(Configuration.JWT_SECRET_KEY);
  }

  async canActivate(executionContext: ExecutionContext): Promise<boolean> {

    console.log('GraphQLJwtAuthGuard canActivate');

    const ctx = GqlExecutionContext.create(executionContext);
    const graphqlContext = ctx.getContext();
    const headers = graphqlContext.headers;

    try {
      const jwtStr = await this.getJwtStringFromHeaders(headers);
      const decodedJwt: JwtPayload = await this.decodeJwtPayload(jwtStr);
      const user = await this.authService.validateUser(decodedJwt);
      graphqlContext.user = user;
      return true;
    }
    catch (e) {
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

  private async getJwtStringFromHeaders(headers): Promise<string> {

    if (!headers || !(headers['authorization'] || headers['Authorization'])) {
      throw new Error('No authorization header provided');
    }

    const authHeader = headers['authorization'] || headers['Authorization'];

    const split = authHeader.split(' ');
    if (split && split.length === 2 && (split[0] === 'Bearer' || split[0] === 'bearer')) {
      const jwtStr = split[1];
      return jwtStr;
    }
    throw new Error('Authorization header is not in expected format: Bearer {{jwt}} ');
  }

  private async decodeJwtPayload(jwtStr: string): Promise<JwtPayload> {
    return new Promise<any>((resolve, reject) => {
      verify(jwtStr, this.jwtKey, function(err, decoded) {
        if (err) {
          reject(err);
        }
        resolve(decoded);
      });
    });
  }
}
