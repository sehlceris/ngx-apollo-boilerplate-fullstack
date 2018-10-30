import { AnyJwtPayload } from '../../auth/jwt-payload.model';
import { User } from '../../../user/models/user.model';

export interface GraphqlContextModel {
  jwt: AnyJwtPayload;
  user: User;
}