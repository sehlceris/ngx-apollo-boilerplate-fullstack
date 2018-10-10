import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ApiException } from '../shared/api-exception.model';
import { GetOperationId } from '../shared/utilities/get-operation-id.helper';
import { RegisterVm } from './models/view-models/register-vm.model';
import {UserApiService} from '../user/user-api.service';
import {RegistrationApiService} from './registration-api.service';
import {UserVm} from '../user/models/view-models/user-vm.model';
import {User} from '../user/models/user.model';

@Controller('registration')
export class RegistrationController {
  constructor(
    private readonly userApiService: UserApiService,
    private readonly registrationApiService: RegistrationApiService
  ) {}

  @Post('register')
  @ApiCreatedResponse({ type: UserVm })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(GetOperationId(User.modelName, 'register'))
  async register(@Body() vm: RegisterVm): Promise<UserVm> {
    return this.userApiService.register(vm);
  }
}
