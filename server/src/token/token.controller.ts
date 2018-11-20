import {Controller, Get, Post, UseGuards, Request, Body} from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApiException } from '../shared/api-exception.model';
import {JwtSingleUseUserPayload} from '../shared/auth/jwt-payload.model';
import {HttpTokenGuard} from '../shared/guards/http/http-token-guard';
import { GetOperationId } from '../shared/utilities/get-operation-id.helper';
import {UserVm} from '../user/models/view-models/user-vm.model';
import { UserApiService } from '../user/user-api.service';
import {Token} from './models/token.model';
import { TokenApiService } from './token-api.service';

@Controller('token')
export class TokenController {
  constructor(private readonly userApiService: UserApiService, private readonly tokenApiService: TokenApiService) {}

  @Get('tokenExists')
  @UseGuards(HttpTokenGuard)
  @ApiBearerAuth()
  @ApiBadRequestResponse({ type: ApiException })
  async tokenExists(@Request() req): Promise<boolean> {
    const jwt: JwtSingleUseUserPayload = req.jwt;
    return this.tokenApiService.tokenExists(jwt);
  }

  @Post('verifyEmail')
  @UseGuards(HttpTokenGuard)
  @ApiBearerAuth()
  @ApiBadRequestResponse({ type: ApiException })
  async verifyEmail(@Request() req): Promise<UserVm>{
    const jwt: JwtSingleUseUserPayload = req.jwt;
    return this.tokenApiService.verifyEmail(jwt);
  }

  @Post('resetPassword')
  @UseGuards(HttpTokenGuard)
  @ApiBearerAuth()
  @ApiBadRequestResponse({ type: ApiException })
  async resetPassword(
    @Request() req,
    @Body('password') password: string,
  ): Promise<UserVm>{
    const jwt: JwtSingleUseUserPayload = req.jwt;
    return this.tokenApiService.resetPassword(jwt, password);
  }
}
