import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { sign, SignOptions } from 'jsonwebtoken';
import { User } from '../../user/models/user.model';
import { UserService } from '../../user/user.service';
import { Configuration } from '../configuration/configuration.enum';
import { ConfigurationService } from '../configuration/configuration.service';
import {
  JwtAuthPayload,
  JwtPayload,
  JwtPayloadType,
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

  async validateUser(validatePayload: JwtAuthPayload): Promise<User> {
    if (validatePayload.type !== JwtPayloadType.Auth) {
      throw new Error(
        `Auth JWT payload must be of type ${JwtPayloadType.Auth}`
      );
    }
    return this._userService.findById(validatePayload.userId);
  }
}
