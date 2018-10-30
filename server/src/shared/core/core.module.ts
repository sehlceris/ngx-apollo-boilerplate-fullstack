import { Module } from '@nestjs/common';
import { SharedModule } from '../shared.module';
import { BackgroundService } from './services/background.service';
import { EmailService } from '../email/email.service';

const SERVICES = [BackgroundService, EmailService];

@Module({
  imports: [SharedModule],
  controllers: [],
  exports: [...SERVICES],
  providers: [...SERVICES],
})
export class CoreModule {
  constructor(private readonly backgroundService: BackgroundService) {
    this.backgroundService.startAllBackgroundServices();
  }
}
