import {ExecutionContext} from '@nestjs/common';
import {InstanceType} from 'typegoose';
import {User} from '../../../user/models/user.model';

export class HttpGuardHelpers {
  static getUserFromContext(executionContext: ExecutionContext): InstanceType<User> {
    const request = executionContext.switchToHttp().getRequest();
    return request.user;
  }
}
