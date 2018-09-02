import { Injectable } from '@nestjs/common';
import { get } from 'config';
import { Configuration } from './configuration.enum';

export enum Environment {
  DEVELOPMENT = 'development',
  TESTING = 'testing',
  PRODUCTION = 'production',
}

@Injectable()
export class ConfigurationService {
  static environment: string = process.env.NODE_ENV || Environment.DEVELOPMENT;

  static get(name: string): string {
    const val = process.env[name] || get(name);
    if (val === undefined || val === null) {
      throw new Error(`Configuration does not have key '${name}'`);
    }
    return val;
  }

  static get isDevelopment(): boolean {
    return ConfigurationService.environment === Environment.DEVELOPMENT;
  }

  static getMongoDbConnectionString() {
    const dbUsername = this.get(Configuration.MONGODB_USERNAME);
    const dbPassword = this.get(Configuration.MONGODB_PASSWORD);
    const dbHost = this.get(Configuration.MONGODB_HOST);
    const dbPort = this.get(Configuration.MONGODB_PORT);
    const dbName = this.get(Configuration.MONGODB_DATABASE_NAME);
    const dbAuthSource = this.get(Configuration.MONGODB_AUTH_SOURCE);

    const databaseUri = `mongodb://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=${dbAuthSource}`;

    return databaseUri;
  }

  // ***** instance methods are for components that use dependency injection *****

  get(name: string): string {
    return ConfigurationService.get(name);
  }

  get isDevelopment(): boolean {
    return ConfigurationService.isDevelopment;
  }
}
