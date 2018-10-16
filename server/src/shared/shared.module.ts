import {Global, Module} from '@nestjs/common';
import {UserModule} from '../user/user.module';
import {AuthService} from './auth/auth.service';
import {JwtStrategy} from './auth/strategies/jwt-strategy.service';
import {ConfigurationService} from './configuration/configuration.service';
import {MapperService} from './mapper/mapper.service';
import {LogService} from './utilities/log.service';
import {MemoryCacheService} from './utilities/memory-cache.service';
import {EmailService} from './email/email.service';
import {RegistrationModule} from '../registration/registration.module';

const SERVICES = [
  ConfigurationService,
  MapperService,
  AuthService,
  LogService,
  MemoryCacheService,
  EmailService,
  JwtStrategy
];

@Global()
@Module({
  providers: [
    ...SERVICES,
  ],
  exports: [
    ...SERVICES
  ],
  imports: [
    UserModule,
    RegistrationModule,
  ],
})
export class SharedModule {
}
