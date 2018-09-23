import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { LoginWithUsernameVm } from './login-vm.model';

export class RegisterVm extends LoginWithUsernameVm {
  @ApiModelProperty({ required: true, minLength: 6 })
  username: string;

  @ApiModelProperty({ required: true })
  email: string;

  @ApiModelProperty({ required: true, minLength: 6 })
  password: string;

  @ApiModelPropertyOptional({ example: 'John' })
  firstName?: string;

  @ApiModelPropertyOptional({ example: 'Doe' })
  lastName?: string;
}
