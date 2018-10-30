import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Configuration } from './shared/configuration/configuration.enum';
import { ConfigurationService } from './shared/configuration/configuration.service';
import { SharedModule } from './shared/shared.module';
import { TodoModule } from './todo/todo.module';
import { UserModule } from './user/user.module';
import { CoreModule } from './shared/core/core.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    SharedModule,
    CoreModule,
    MongooseModule.forRoot(ConfigurationService.getMongoDbConnectionString(), {
      retryDelay: 500,
      retryAttempts: 3,
    }),
    GraphQLModule.forRoot({
      typePaths: ['./src/**/*.types.graphql'],
      installSubscriptionHandlers: true,
      context: ({ req }) => {
        return {
          headers: {
            ...req.headers,
          },
        };
      },
    }),
    UserModule,
    TokenModule,
    TodoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static host: string;
  static port: number | string;
  static isDev: boolean;

  constructor(private readonly _configurationService: ConfigurationService) {
    AppModule.port = AppModule.normalizePort(
      _configurationService.get(Configuration.SERVER_PORT)
    );
    AppModule.host = _configurationService.get(Configuration.SERVER_HOST);
    AppModule.isDev = _configurationService.isDevelopment;
  }

  private static normalizePort(param: number | string): number | string {
    const portNumber: number =
      typeof param === 'string' ? parseInt(param, 10) : param;
    if (isNaN(portNumber)) return param;
    else if (portNumber >= 0) return portNumber;
  }
}
