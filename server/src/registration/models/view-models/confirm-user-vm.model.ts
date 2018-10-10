import { ApiModelProperty } from '@nestjs/swagger';
import {UserVm} from './user-vm.model';

export class ConfirmUserVm {
  @ApiModelProperty({ required: true })
  confirmationToken: string;
}
