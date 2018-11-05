import { ExecutionContext } from '@nestjs/common';
import { User } from '../../../user/models/user.model';
import { AnyJwtPayload } from '../../auth/jwt-payload.model';
import { GuardHelpers } from '../shared/helpers';
import { HttpRequestContextModel } from './http-request-context.model';

export class HttpGuardHelpers extends GuardHelpers {
  static async getJwtPayloadExecutionContext(executionContext: ExecutionContext): Promise<AnyJwtPayload> {
    const request = executionContext.switchToHttp().getRequest<HttpRequestContextModel>();

    if (request.jwt) {
      return request.jwt; // return cached jwt if found
    }

    const headers = request.headers;
    const jwtString = this.getJwtStringFromHeaders(headers);
    const jwtPayload = await this.verifyJwtPayload(jwtString);
    request.jwt = jwtPayload; //cache jwt
    return jwtPayload;
  }

  static getUserFromAuthenticatedContext(executionContext: ExecutionContext): User {
    const request = executionContext.switchToHttp().getRequest();
    return request.user;
  }
}
