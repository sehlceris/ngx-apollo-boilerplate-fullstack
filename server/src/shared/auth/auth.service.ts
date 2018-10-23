import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { sign, SignOptions } from 'jsonwebtoken';
import { User } from '../../user/models/user.model';
import { UserService } from '../../user/user.service';
import { Configuration } from '../configuration/configuration.enum';
import { ConfigurationService } from '../configuration/configuration.service';
import {
  JwtAuthPayload,
  JwtPayload,
  JwtPayloadType, JwtSingleUseUserPayload, JwtUserPayload,
} from './jwt-payload.model';

@Injectable()
export class AuthService {
  private readonly jwtOptions: SignOptions;
  private readonly jwtKey: string;

  constructor(
    @Inject(forwardRef(() => UserService)) readonly _userService: UserService,
    private readonly _configurationService: ConfigurationService
  ) {
    this.jwtOptions = {
      expiresIn: _configurationService.get(
        Configuration.JWT_AUTH_TOKEN_EXPIRATION
      ),
    };
    this.jwtKey = _configurationService.get(Configuration.JWT_SECRET_KEY);
  }

  async signPayload(
    payload: JwtPayload,
    options: SignOptions = {}
  ): Promise<string> {
    return sign(payload, this.jwtKey, {
      ...this.jwtOptions,
      ...options,
    });
  }

  async validateUserAuthentication(validatePayload: JwtAuthPayload): Promise<User> {
    const payloadType = JwtPayloadType.Auth;
    if (validatePayload.type !== payloadType) {
      throw new Error(
        `Auth JWT payload must be of type ${payloadType}`
      );
    }
    return this.getValidatedUser(validatePayload);
  }

  async validateUserEmailVerification(validatePayload: JwtSingleUseUserPayload): Promise<User> {
    const payloadType = JwtPayloadType.VerifyEmail;
    if (validatePayload.type !== payloadType) {
      throw new Error(
        `Auth JWT payload must be of type ${payloadType}`
      );
    }
    return this.getValidatedUser(validatePayload);
  }

  async validateUserPasswordReset(validatePayload: JwtSingleUseUserPayload): Promise<User> {
    const payloadType = JwtPayloadType.ResetPassword;
    if (validatePayload.type !== payloadType) {
      throw new Error(
        `Auth JWT payload must be of type ${payloadType}`
      );
    }
    return this.getValidatedUser(validatePayload);
  }

  private async getValidatedUser(validatePayload: JwtUserPayload) {
    const user = await this._userService.findById(validatePayload.userId);
    if (validatePayload.securityIdentifier !== user.securityIdentifier) {
      throw new Error(
        'Security identifier mismatch'
      );
    }
    return user;
  }
}
