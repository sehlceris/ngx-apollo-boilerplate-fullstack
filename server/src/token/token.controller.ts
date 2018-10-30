import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ApiException } from '../shared/api-exception.model';
import { GetOperationId } from '../shared/utilities/get-operation-id.helper';
import { UserApiService } from '../user/user-api.service';
import { TokenApiService } from './token-api.service';
import { UserVm } from '../user/models/view-models/user-vm.model';
import { User } from '../user/models/user.model';

@Controller('token')
export class TokenController {
  constructor(
    private readonly userApiService: UserApiService,
    private readonly tokenApiService: TokenApiService
  ) {}

  @Post('verifyEmail')
  @ApiCreatedResponse({ type: UserVm })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(GetOperationId(User.modelName, 'verifyEmail'))
  async verifyEmail(@Body() vm: any): Promise<any> {
    return null;
  }
}
