import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy, VerifiedCallback} from 'passport-jwt';
import {Configuration} from '../../configuration/configuration.enum';
import {ConfigurationService} from '../../configuration/configuration.service';
import {AuthService} from '../auth.service';
import {JwtAuthPayload} from '../jwt-payload.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _authService: AuthService,
    private readonly _configurationService: ConfigurationService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configurationService.get(Configuration.JWT_SECRET_KEY),
    });
  }

  async validate(payload: JwtAuthPayload, done: VerifiedCallback) {
    const user = await this._authService.validateUserAuthentication(payload);
    if (!user) {
      return done(new HttpException({}, HttpStatus.UNAUTHORIZED), false);
    }

    return done(null, user, payload.iat);
  }
}
