import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InstanceType } from 'typegoose';
import { User } from '../../../user/models/user.model';
import { AbstractUserRoleGuard } from '../shared/abstract-user-role.guard';

@Injectable()
export class HttpRolesGuard extends AbstractUserRoleGuard {
  protected constructor(protected readonly _reflector: Reflector) {
    super(_reflector);
  }

  getUserFromContext(context: ExecutionContext): InstanceType<User> {
    const request = context.switchToHttp().getRequest();
    return request.user;
  }
}
