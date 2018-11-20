import {ApiModelProperty} from '@nestjs/swagger';

export class ResetPasswordVm {
  @ApiModelProperty({required: true})
  password: string;
}
