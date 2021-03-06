import {Global, Module} from '@nestjs/common';
import {UserModule} from '../user/user.module';
import {AuthService} from './auth/auth.service';
import {JwtStrategy} from './auth/strategies/jwt-strategy.service';
import {ConfigurationService} from './configuration/configuration.service';
import {MapperService} from './mapper/mapper.service';
import {LogService} from './utilities/log.service';
import {MemoryCacheService} from './utilities/memory-cache.service';

const SERVICES = [ConfigurationService, MapperService, AuthService, LogService, MemoryCacheService, JwtStrategy];

@Global()
@Module({
  imports: [UserModule],
  exports: [UserModule, ...SERVICES],
  providers: [...SERVICES],
})
export class SharedModule {}
