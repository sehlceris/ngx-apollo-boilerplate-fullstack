import { UserRole } from '../../user/models/user-role.enum';

export enum JwtPayloadType {
  Auth = 'Auth',
  VerifyEmail = 'VerifyEmail',
  ResetPassword = 'ResetPassword',
}

export interface JwtPayload {
  userId: string;
  username: string;
  role: UserRole;
  type: JwtPayloadType;
  iat?: Date;
  exp?: Date;
}

export interface JwtSingleUsePayload extends JwtPayload {
  jti: string;
}
