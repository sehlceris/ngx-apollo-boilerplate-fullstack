import {ExecutionContext} from '@nestjs/common';
import {User} from '../../../user/models/user.model';
import {AnyJwtPayload} from '../../auth/jwt-payload.model';
import {GuardHelpers} from '../shared/helpers';
import {HttpRequestContextModel} from './http-request-context.model';

export class HttpGuardHelpers extends GuardHelpers {
  static async getJwtPayloadFromExecutionContext(executionContext: ExecutionContext): Promise<AnyJwtPayload> {
    const request = executionContext.switchToHttp().getRequest<HttpRequestContextModel>();
    console.log('request', request.headers);
    if (!request.jwt) {
      const headers = request.headers;
      const jwtString = this.getJwtStringFromHeaders(headers);
      const jwtPayload = await this.verifyJwtPayload(jwtString);
      request.jwt = jwtPayload; //cache jwt
    }
    return {...request.jwt};
  }

  static getUserFromAuthenticatedContext(executionContext: ExecutionContext): User {
    const request = executionContext.switchToHttp().getRequest();
    return request.user;
  }
}
