import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus, Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InstanceType } from 'typegoose';
import { UserRole } from '../../../user/models/user-role.enum';
import { User } from '../../../user/models/user.model';
import {AbstractUserGuard} from '../shared/abstract-user.guard';
import {GqlExecutionContext} from '@nestjs/graphql';
import {TARGET_USER_ID_METADATA_KEY} from '../../decorators/user-id-mapper.decorator';

@Injectable()
export abstract class SameUserGuard extends AbstractUserGuard {

  constructor(protected readonly _reflector: Reflector) {
    super(_reflector);
    console.log('SameUserGuard constructor');
  }

  getUserFromContext(executionContext: ExecutionContext): InstanceType<User> {
    const ctx = GqlExecutionContext.create(executionContext);
    const graphqlContext = ctx.getContext();
    return graphqlContext.user;
  }

  protected async checkCanActivate(context: ExecutionContext): Promise<boolean> {
    console.log(`SameUserGuard: _reflector=`, this._reflector);
    const targetUserId = this._reflector.get<string>(
      TARGET_USER_ID_METADATA_KEY,
      context.getHandler()
    );
    console.log(`SameUserGuard: targetUserId=`, targetUserId);
    const user: InstanceType<User> = this.getUserFromContext(context);
    console.log(`SameUserGuard\n\ttargetUserId=${targetUserId}\n\tuser.id=${user.id}`);
    return (user && targetUserId && user.id === targetUserId);
  }
}
