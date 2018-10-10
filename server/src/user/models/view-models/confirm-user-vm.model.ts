import { ApiModelProperty } from '@nestjs/swagger';
import {UserVm} from './user-vm.model';

export class ConfirmUserVm {
  @ApiModelProperty({ required: true })
  userId: string;

  @ApiModelProperty({ required: true })
  confirmationToken: string;
}

export class ConfirmUserResponseVm {
  @ApiModelProperty({ required: true })
  user: UserVm;

  @ApiModelProperty({ required: true })
  confirmationToken: string;
}
