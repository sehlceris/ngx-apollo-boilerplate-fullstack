import { ExecutionContext, Injectable } from '@nestjs/common';
import { InstanceType } from 'typegoose';
import { User } from '../../../user/models/user.model';
import { AbstractRolesOrSelfGuard } from '../shared/abstract-roles-or-self.guard';
import { Reflector } from '@nestjs/core';
import { HttpGuardHelpers } from './helpers';
import { IncomingMessage } from 'http';
import { parse } from 'url';

@Injectable()
export abstract class HttpRolesOrSelfGuard extends AbstractRolesOrSelfGuard {
  private static forQueryStringIdKeyCache: Map<string, any> = new Map<
    string,
    any
  >();

  private static forParamIdKeyCache: Map<string, any> = new Map<string, any>();

  private static forBodyIdKeyCache: Map<string, any> = new Map<string, any>();

  constructor(protected readonly _reflector: Reflector) {
    super(_reflector);
  }

  static forQueryStringIdKey(key: string) {
    if (this.forQueryStringIdKeyCache.has(key)) {
      return this.forQueryStringIdKeyCache.get(key);
    }
    const c = class HttpRolesOrSelfFromQueryStringGuard extends HttpRolesOrSelfGuard {
      getTargetUserIdFromContext(executionContext: ExecutionContext): string {
        const incomingMessage: IncomingMessage = executionContext.getArgByIndex(
          0
        );
        const parsedUrl = parse(incomingMessage.url, true);
        const id = <string>parsedUrl.query[key];
        return id;
      }
    };
    this.forQueryStringIdKeyCache.set(key, c);
    return c;
  }

  static forParamIdKey(key: string) {
    if (this.forParamIdKeyCache.has(key)) {
      return this.forParamIdKeyCache.get(key);
    }
    const c = class HttpRolesOrSelfFromParamGuard extends HttpRolesOrSelfGuard {
      getTargetUserIdFromContext(executionContext: ExecutionContext): string {
        const id = executionContext.switchToHttp().getRequest().params[key];
        return id;
      }
    };
    this.forParamIdKeyCache.set(key, c);
    return c;
  }

  static forBodyIdKey(key: string) {
    if (this.forBodyIdKeyCache.has(key)) {
      return this.forBodyIdKeyCache.get(key);
    }
    const c = class HttpRolesOrSelfFromBodyGuard extends HttpRolesOrSelfGuard {
      getTargetUserIdFromContext(executionContext: ExecutionContext): string {
        const id = executionContext.switchToHttp().getRequest().body[key];
        return id;
      }
    };
    this.forBodyIdKeyCache.set(key, c);
    return c;
  }

  abstract getTargetUserIdFromContext(
    executionContext: ExecutionContext
  ): string;

  protected getUserFromContext(
    executionContext: ExecutionContext
  ): InstanceType<User> {
    return HttpGuardHelpers.getUserFromContext(executionContext);
  }
}
