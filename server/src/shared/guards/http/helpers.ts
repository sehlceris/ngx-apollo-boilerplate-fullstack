import { ExecutionContext } from '@nestjs/common';
import { User } from '../../../user/models/user.model';
import { AnyJwtPayload } from "../../auth/jwt-payload.model";
import { GuardHelpers } from '../shared/helpers';

export class HttpGuardHelpers extends GuardHelpers {

  static async getJwtPayloadFromAuthenticatedContext(
    executionContext: ExecutionContext
  ): Promise<AnyJwtPayload> {
    const headers = executionContext.switchToHttp().getRequest().headers;
    const jwtString = this.getJwtStringFromHeaders(headers);
    const jwtPayloadPromise = this.decodeJwtPayload(jwtString);
    return jwtPayloadPromise;
  }

  static getUserFromAuthenticatedContext(
    executionContext: ExecutionContext
  ): User {
    const request = executionContext.switchToHttp().getRequest();
    return request.user;
  }
}
