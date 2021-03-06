import {Injectable} from '@nestjs/common';
import {BoundLogger, LogService} from './log.service';
import {ConfigurationService} from '../configuration/configuration.service';
import {Configuration} from '../configuration/configuration.enum';

import * as redis from 'redis';
import * as moment from 'moment';
import * as bluebird from 'bluebird';

bluebird.promisifyAll(redis);

interface JtiInfo {
  jti: string;
  exp: moment.Moment;
}

@Injectable()
export class MemoryCacheService {
  private log: BoundLogger = this.logService.bindToNamespace(MemoryCacheService.name);

  private _client;

  constructor(private configurationService: ConfigurationService, private logService: LogService) {
    this.initializeCache();
  }

  public get client() {
    return this._client;
  }

  public async addJti(jti: string, exp?: number) {
    if (exp) {
      const ttl = Math.ceil(moment.unix(exp).diff(moment()) / 1000);
      return this._client.setAsync(jti, true, 'EX', ttl);
    } else {
      return this._client.setAsync(jti, true);
    }
  }

  public async hasJti(jti: string) {
    const hasJti = await this._client.existsAsync(jti);
    return hasJti;
  }

  public async removeJti(jti: string) {
    return this._client.delAsync(jti);
  }

  public initializeCache() {
    const host = this.configurationService.get(Configuration.REDIS_HOST);
    const port = this.configurationService.get(Configuration.REDIS_PORT);
    const password = this.configurationService.get(Configuration.REDIS_PASSWORD);

    const clientOpts = {
      host,
      password,
      port: parseInt(port, 10),
    };

    if (this._client) {
      this._client.quit();
      this._client = null;
    }

    this._client = redis.createClient(clientOpts);
  }
}
