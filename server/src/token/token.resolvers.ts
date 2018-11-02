import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtPayloadType, JwtSingleUseUserPayload } from '../shared/auth/jwt-payload.model';
import { GraphqlTokenGuard } from '../shared/guards/graphql/graphql-token-guard';
import { BoundLogger, LogService } from '../shared/utilities/log.service';
import { UserVm } from '../user/models/view-models/user-vm.model';
import { TokenApiService } from './token-api.service';
import { AllowedJwtPayloadType } from '../shared/decorators/allowed-jwt-payload-type';

@Resolver('Token')
export class TokenResolvers {

  private log: BoundLogger = this.logService.bindToNamespace(TokenResolvers.name);

  constructor(
    protected readonly tokenApiService: TokenApiService,
    private logService: LogService,
  ) {
  }

  @Query('tokenExists')
  @UseGuards(GraphqlTokenGuard)
  async tokenExists(@Context('jwt') jwt: JwtSingleUseUserPayload): Promise<boolean> {
    this.log.debug(`checking existence of JTI: ${jwt.jti}`);
    return true;
  }

  @Mutation('verifyEmail')
  @AllowedJwtPayloadType(JwtPayloadType.VerifyEmail)
  @UseGuards(GraphqlTokenGuard)
  async verifyEmail(@Context('jwt') jwt: JwtSingleUseUserPayload): Promise<UserVm> {
    return this.tokenApiService.verifyEmail(jwt);
  }

  @Mutation('resetPassword')
  @AllowedJwtPayloadType(JwtPayloadType.ResetPassword)
  @UseGuards(GraphqlTokenGuard)
  async resetPassword(
    @Context('jwt') jwt: JwtSingleUseUserPayload,
    @Args('password') password: string,
  ): Promise<UserVm> {
    return this.tokenApiService.resetPassword(jwt, password);
  }
}
