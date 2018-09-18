import { Component, OnInit } from '@angular/core';

import { ROUTE_ANIMATIONS_ELEMENTS } from 'app/core/index';
import { BoundLogger, LogService } from '@app/core/services';
import { AuthService } from '@app/core/auth/auth.service';

@Component({
  selector: 'anms-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  releaseButler = require('../../../../assets/release-butler.png');

  private log: BoundLogger = this.logService.bindToNamespace('AboutComponent');

  constructor(
    private logService: LogService
  ) {}

  ngOnInit() {}
}
