import { Global, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/strategies/jwt-strategy.service';
import { ConfigurationService } from './configuration/configuration.service';
import { MapperService } from './mapper/mapper.service';
import { LogService } from './utilities/log.service';
import { RedisService } from './utilities/redis.service';

const SERVICES = [ConfigurationService, MapperService, AuthService, LogService, RedisService, JwtStrategy];

@Global()
@Module({
  imports: [UserModule],
  exports: [UserModule, ...SERVICES],
  providers: [...SERVICES],
})
export class SharedModule {}
