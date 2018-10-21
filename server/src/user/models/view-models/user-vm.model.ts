import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseModelVm } from '../../../shared/base.model';
import { UserRole } from '../user-role.enum';

export class UserVm extends BaseModelVm {
  @ApiModelProperty()
  username: string;
  @ApiModelProperty()
  email: string;
  @ApiModelProperty()
  securityIdentifier?: string;
  @ApiModelPropertyOptional({ enum: UserRole })
  role?: UserRole;
}
