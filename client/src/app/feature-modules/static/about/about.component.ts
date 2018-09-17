import { Component, OnInit } from '@angular/core';

import { ROUTE_ANIMATIONS_ELEMENTS } from 'app/core/index';
import { UserHttpApiService } from '@app/core/services/api/user-http-api.service';
import {
  LoginWithUsername,
  LoginWithUsernameGQL,
} from '@app/generated/anms-graphql-client';
import { BoundLogger, LogService } from '@app/core/services';
import { ExecutionResult, FetchResult } from 'apollo-link';
import { map } from 'rxjs/operators';
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
    private authService: AuthService,
    private logService: LogService
  ) {}

  ngOnInit() {}

  loginWithGraphQl() {
    this.authService.loginWithUsername('000000', '000000').subscribe();
  }
}
