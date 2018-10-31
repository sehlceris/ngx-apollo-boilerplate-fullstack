import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtSingleUseUserPayload } from "../shared/auth/jwt-payload.model";
import { RedisService } from "../shared/utilities/redis.service";
import { UserRole } from "../user/models/user-role.enum";
import { User } from "../user/models/user.model";
import { UserVm } from "../user/models/view-models/user-vm.model";
import { UserService } from "../user/user.service";
import { TokenService } from "./token.service";

@Injectable()
export class TokenApiService {
  constructor(
    protected readonly tokenService: TokenService,
    protected readonly memoryCacheService: RedisService,
    protected readonly userService: UserService,
  ) {
  }

  async tokenExists(vm: JwtSingleUseUserPayload): Promise<boolean> {
    return true; // the token is already verified to be existing via the token guard
  }

  async verifyEmail(vm: JwtSingleUseUserPayload): Promise<UserVm> {
    await this.consumeJti(vm);
    const user = await this.userService.findById(vm.userId);
    user.role = UserRole.User;

    try {
      const updatedUser = await this.userService.update(vm.userId, user);
      return updatedUser.toJSON() as User;
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async resetPassword(vm: JwtSingleUseUserPayload, password: string): Promise<UserVm> {
    await this.consumeJti(vm);
    return this.userService.updatePasswordById(vm.userId, password);
  }

  private async consumeJti(vm: JwtSingleUseUserPayload): Promise<void> {
    return this.memoryCacheService.removeJti(vm.jti);
  }
}
