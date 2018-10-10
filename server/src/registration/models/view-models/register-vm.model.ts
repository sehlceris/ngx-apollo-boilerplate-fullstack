import { ApiModelProperty } from '@nestjs/swagger';

export class RegisterVm {
  @ApiModelProperty({ required: true, minLength: 4 })
  username: string;

  @ApiModelProperty({ required: true })
  email: string;

  @ApiModelProperty({
    required: true,
    minLength: 6,
    type: String,
    format: 'password',
  })
  password: string;
}
