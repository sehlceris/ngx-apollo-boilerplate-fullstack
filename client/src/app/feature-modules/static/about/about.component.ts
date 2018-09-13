import { Component, OnInit } from '@angular/core';

import { ROUTE_ANIMATIONS_ELEMENTS } from 'app/core/index';
import { UserHttpApiService } from '@app/core/services/api/user-http-api.service';
import { LoginWithUsernameGQL } from '@app/generated/anms-graphql-client';
import { BoundLogger, LogService } from '@app/core/services';

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
    public userHttpApiService: UserHttpApiService,
    public loginWithUsernameGQL: LoginWithUsernameGQL,
    private logService: LogService
  ) {}

  ngOnInit() {
    console.log('graphql logging in...');
    this.loginWithUsernameGQL
      .mutate({
        username: '000000',
        password: '000000',
      })
      .pipe(this.log.tapObservableForLogging('graphql login'))
      .subscribe();
  }
}
