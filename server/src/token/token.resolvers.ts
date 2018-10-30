import { Query, UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import {
  AnyJwtPayload, AnyJwtUserPayload,
  JwtSingleUseUserPayload
} from "../shared/auth/jwt-payload.model";
import { AllowedJwtPayloadType } from "../shared/decorators/allowed-jwt-payload-type";
import { GraphqlTokenGuard } from "../shared/guards/graphql/graphql-token-guard";
import { BoundLogger, LogService } from "../shared/utilities/log.service";
import { UserVm } from '../user/models/view-models/user-vm.model';
import { TokenApiService } from "./token-api.service";

@Resolver('Token')
export class TokenResolvers {

  private log: BoundLogger = this.logService.bindToNamespace(TokenResolvers.name);

  constructor(
    protected readonly tokenApiService: TokenApiService,
    private logService: LogService,
  ) {}

  @Query('tokenExists')
  @UseGuards(GraphqlTokenGuard)
  async tokenExists(@Context('jwt') jwt: JwtSingleUseUserPayload): Promise<boolean> {
    this.log.debug(`checking existence of JTI: ${jwt.jti}`);
    return true;
  }

  @Mutation('verifyEmail')
  async verifyEmail(@Args() vm: any): Promise<UserVm> {
    return null
  }
}
