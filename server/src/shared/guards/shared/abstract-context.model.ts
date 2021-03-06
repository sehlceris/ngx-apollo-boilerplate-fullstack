import {AnyJwtPayload} from '../../auth/jwt-payload.model';
import {User} from '../../../user/models/user.model';

export interface AbstractContextModel {
  jwt?: AnyJwtPayload;
  user?: User;
  headers?: any;
}
