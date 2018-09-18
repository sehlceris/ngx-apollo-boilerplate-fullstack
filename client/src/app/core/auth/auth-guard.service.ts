import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { select, Store } from "@ngrx/store";

import { selectorAuth } from './auth.reducer';

@Injectable()
export class AuthGuardService implements CanActivate {
  isAuthenticated = false;

  constructor(private store: Store<any>) {
    this.store
      .pipe(
        select(selectorAuth),
      )
      .subscribe((auth) => (this.isAuthenticated = !!auth.token));
  }
  canActivate(): boolean {
    return this.isAuthenticated;
  }
}
