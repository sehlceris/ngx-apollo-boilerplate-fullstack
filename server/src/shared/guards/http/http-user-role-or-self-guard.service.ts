import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { InstanceType } from 'typegoose';
import { User } from '../../../user/models/user.model';
import {AbstractUserRoleOrSelfGuard} from '../shared/abstract-user-role-or-self.guard';
import {Reflector} from '@nestjs/core';
import {HttpGuardHelpers} from './helpers';
import {IncomingMessage} from 'http';
import {parse} from 'url';

@Injectable()
export abstract class HttpUserRoleOrSelfGuard extends AbstractUserRoleOrSelfGuard {

  constructor(protected readonly _reflector: Reflector) {
    super(_reflector);
  }

  static forQueryStringKey(key: string) {
    const newClass = class extends HttpUserRoleOrSelfGuard {
      getTargetUserIdFromContext(executionContext: ExecutionContext): string {
        const incomingMessage: IncomingMessage = executionContext.getArgByIndex(0);
        const parsedUrl = parse(incomingMessage.url, true);
        const id = <string>parsedUrl.query[key];
        return id;
      }
    };
    return newClass;
  }

  static forParamKey(key: string) {
    const newClass = class extends HttpUserRoleOrSelfGuard {
      getTargetUserIdFromContext(executionContext: ExecutionContext): string {
        const id = executionContext.switchToHttp().getRequest().params[key];
        return id;
      }
    };
    return newClass;
  }

  abstract getTargetUserIdFromContext(executionContext: ExecutionContext): string;

  protected getUserFromContext(executionContext: ExecutionContext): InstanceType<User> {
    return HttpGuardHelpers.getUserFromContext(executionContext);
  }
}
