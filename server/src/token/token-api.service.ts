import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TokenService } from './token.service';
import { UserVm } from '../user/models/view-models/user-vm.model';
import { User } from '../user/models/user.model';
import { Token, TokenModel } from './models/token.model';
import { VerifyEmailVm } from './models/view-models/verify-email-vm.model';
import { MemoryCacheService } from '../shared/utilities/memory-cache.service';
import { JwtSingleUseUserPayload } from '../shared/auth/jwt-payload.model';
import { UserService } from '../user/user.service';

@Injectable()
export class TokenApiService {
  constructor(
    protected readonly tokenService: TokenService,
    protected readonly memoryCacheService: MemoryCacheService,
    protected readonly userService: UserService,
  ) {
  }

  async tokenExists(vm: JwtSingleUseUserPayload): Promise<boolean> {
    const hasJti = await this.memoryCacheService.hasJti(vm.type, vm.jti);
    return hasJti;
  }

  async verifyEmail(vm: JwtSingleUseUserPayload): Promise<UserVm> {
    const tokenExists = await this.tokenExists(vm);
    return null;
  }
}
