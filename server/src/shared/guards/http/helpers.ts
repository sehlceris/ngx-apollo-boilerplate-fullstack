import { ExecutionContext } from '@nestjs/common';
import { User } from '../../../user/models/user.model';

export class HttpGuardHelpers {




  static getUserFromContext(
    executionContext: ExecutionContext
  ): User {
    const request = executionContext.switchToHttp().getRequest();
    return request.user;
  }
}
