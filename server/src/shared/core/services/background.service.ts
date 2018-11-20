import {Injectable} from '@nestjs/common';
import {BoundLogger, LogService} from '../../utilities/log.service';
import {Subject} from 'rxjs';
import {EmailService} from '../../email/email.service';

@Injectable()
export class BackgroundService {
  private log: BoundLogger = this.logService.bindToNamespace(BackgroundService.name);
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private emailService: EmailService, private logService: LogService) {}

  startAllBackgroundServices() {
    // a wait of 1000ms allows all forwardRefs() to be completed and dependencies injected
    setTimeout(() => {
      this.log.info(`starting background services`);
      this.emailService.startReactingToEvents();
    }, 1000);
  }
}
