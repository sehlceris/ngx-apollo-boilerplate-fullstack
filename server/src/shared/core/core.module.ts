import { Module } from '@nestjs/common';
import { TodoModule } from '../../todo/todo.module';
import { TokenModule } from '../../token/token.module';
import { UserModule } from '../../user/user.module';
import { SharedModule } from '../shared.module';
import { BackgroundService } from './services/background.service';
import { EmailService } from '../email/email.service';

const MODULES = [SharedModule, TokenModule, UserModule, TodoModule];
const SERVICES = [BackgroundService, EmailService];

@Module({
  imports: [...MODULES],
  controllers: [],
  exports: [...SERVICES],
  providers: [...SERVICES],
})
export class CoreModule {
  constructor(private readonly backgroundService: BackgroundService) {
    this.backgroundService.startAllBackgroundServices();
  }
}
