import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {selectorUser} from '@app/core/auth/user/user.reducer';
import {select, Store} from '@ngrx/store';

@Injectable()
export class AuthGuardService implements CanActivate {
  isAuthenticated = false;

  constructor(private store: Store<any>) {
    this.store.pipe(select(selectorUser)).subscribe((user) => (this.isAuthenticated = !!user.token));
  }
  canActivate(): boolean {
    return this.isAuthenticated;
  }
}
