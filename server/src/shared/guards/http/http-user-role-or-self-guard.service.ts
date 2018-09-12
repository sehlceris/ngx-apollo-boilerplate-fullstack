import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { InstanceType } from 'typegoose';
import { User } from '../../../user/models/user.model';
import {AbstractRolesOrSelfGuard} from '../shared/abstract-roles-or-self.guard';
import {Reflector} from '@nestjs/core';
import {HttpGuardHelpers} from './helpers';
import {IncomingMessage} from 'http';
import {parse} from 'url';

@Injectable()
export abstract class HttpRolesOrSelfGuard extends AbstractRolesOrSelfGuard {

  constructor(protected readonly _reflector: Reflector) {
    super(_reflector);
  }

  static forQueryStringIdKey(key: string) {
    return class HttpRolesOrSelfFromQueryStringGuard extends HttpRolesOrSelfGuard {
      getTargetUserIdFromContext(executionContext: ExecutionContext): string {
        const incomingMessage: IncomingMessage = executionContext.getArgByIndex(0);
        const parsedUrl = parse(incomingMessage.url, true);
        const id = <string>parsedUrl.query[key];
        return id;
      }
    };
  }

  static forParamIdKey(key: string) {
    return class HttpRolesOrSelfFromParamGuard extends HttpRolesOrSelfGuard {
      getTargetUserIdFromContext(executionContext: ExecutionContext): string {
        const id = executionContext.switchToHttp().getRequest().params[key];
        return id;
      }
    };
  }

  static forBodyIdKey(key: string) {
    return class HttpRolesOrSelfFromBodyGuard extends HttpRolesOrSelfGuard {
      getTargetUserIdFromContext(executionContext: ExecutionContext): string {
        const id = executionContext.switchToHttp().getRequest().body[key];
        return id;
      }
    };
  }

  abstract getTargetUserIdFromContext(executionContext: ExecutionContext): string;

  protected getUserFromContext(executionContext: ExecutionContext): InstanceType<User> {
    return HttpGuardHelpers.getUserFromContext(executionContext);
  }
}
