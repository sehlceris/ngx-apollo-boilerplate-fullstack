import { UserRole } from '../../user/models/user-role.enum';

export enum JwtPayloadType {
  Auth = 'Auth',
  VerifyEmail = 'VerifyEmail',
  ResetPassword = 'ResetPassword',
}

export interface JwtPayload {
  type: JwtPayloadType;
  iat?: Date;
  exp?: Date;
}

export interface JwtUserPayload extends JwtPayload {
  userId: string;
  securityIdentifier: string;
}

export interface JwtAuthPayload extends JwtUserPayload {
  role: UserRole;
}

export interface JwtSingleUseUserPayload extends JwtUserPayload {
  jti: string;
}

export type AnyJwtUserPayload =
  JwtUserPayload
  | JwtAuthPayload
  | JwtSingleUseUserPayload;

export type AnyJwtPayload =
  JwtPayload
  | JwtUserPayload
  | JwtAuthPayload
  | JwtSingleUseUserPayload;