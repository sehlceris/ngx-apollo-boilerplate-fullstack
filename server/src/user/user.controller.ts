import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger';
import { ApiException } from '../shared/api-exception.model';
import { GetOperationId } from '../shared/utilities/get-operation-id.helper';
import { User } from './models/user.model';
import { LoginResponseVm } from './models/view-models/login-response-vm.model';
import { LoginVm } from './models/view-models/login-vm.model';
import { RegisterVm } from './models/view-models/register-vm.model';
import { UserVm } from './models/view-models/user-vm.model';
import {UserApiService} from './user-api.service';

@Controller('user')
@ApiUseTags(User.modelName)
export class UserController {
  constructor(private readonly userApiService: UserApiService) {}

  @Post('register')
  @ApiCreatedResponse({ type: UserVm })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(GetOperationId(User.modelName, 'Register'))
  async register(@Body() vm: RegisterVm): Promise<UserVm> {
    return this.userApiService.register(vm);
  }

  @Post('login')
  @ApiCreatedResponse({ type: LoginResponseVm })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(GetOperationId(User.modelName, 'Login'))
  async login(@Body() vm: LoginVm): Promise<LoginResponseVm> {
    return this.userApiService.login(vm);
  }
}
