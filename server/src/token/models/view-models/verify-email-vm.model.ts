import { ApiModelProperty } from '@nestjs/swagger';
import { UserVm } from './user-vm.model';

export class VerifyEmailVm {
  @ApiModelProperty({ required: true })
  confirmationToken: string;
}
