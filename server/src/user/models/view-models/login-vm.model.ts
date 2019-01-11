import {ApiModelProperty} from '@nestjs/swagger';

export class PasswordPropertyVm {
  @ApiModelProperty({
    required: true,
    minLength: 6,
    type: String,
    format: 'password',
  })
  password: string;
}

export class LoginWithUsernameVm extends PasswordPropertyVm {
  @ApiModelProperty({required: true, minLength: 4})
  username: string;
}

export class LoginWithEmailVm extends PasswordPropertyVm {
  @ApiModelProperty({required: true})
  email: string;
}

export class LoginWithIdVm extends PasswordPropertyVm {
  @ApiModelProperty({required: true})
  id: string;
}
