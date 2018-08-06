import {ElementRef, Injectable} from '@angular/core';
import {BoundLogger, LogService} from './log-service';

@Injectable()
export class DomAbstractionService {

  private log: BoundLogger = this.logService.bindToNamespace('DomAbstractionService');

  constructor(
    private logService: LogService,
  ) {
  }

  focus(el: ElementRef) {
    // TODO: if no dom, do not attempt focus
    try {

    }
    catch (e) {
      this.log.info(`Failed to focus element: ${e}`);
    }
  }

}