import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionLoginWithUsernameRequest,
  ActionLoginSuccess,
  ActionLoginFailure,
  ActionLogoutRequest,
  ActionLogoutSuccess,
  LoginActionTypes,
} from '@app/core/auth/login/login.reducer';
import {
  ActionUserAuthenticate,
  ActionUserUnauthenticate,
} from '@app/core/auth/user/user.reducer';
import { BoundLogger, LogService } from '@app/core/services';
import { LoginWithUsernameGQL } from '@app/generated/anms-graphql-client';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class LoginEffects {
  private log: BoundLogger = this.logService.bindToNamespace(LoginEffects.name);

  constructor(
    private actions$: Actions<Action>,
    private router: Router,
    private loginWithUsernameGQL: LoginWithUsernameGQL,
    private logService: LogService
  ) {}

  @Effect({ dispatch: true })
  loginRequest() {
    return this.actions$.pipe(
      ofType<ActionLoginWithUsernameRequest>(
        LoginActionTypes.LOGIN_WITH_USERNAME_REQUEST
      ),
      this.log.tapObservableForLogging('loginRequest'),
      switchMap((action) => {
        return this.loginWithUsernameGQL.mutate(action).pipe(
          map((result) => result.data.loginWithUsername),
          switchMap((loginWithUsername) => [
            new ActionLoginSuccess(),
            new ActionUserAuthenticate(
              loginWithUsername.token,
              loginWithUsername.user
            ),
          ]),
          catchError((err) => of(new ActionLoginFailure(err)))
        );
      })
    );
  }

  @Effect({ dispatch: false })
  loginSuccess() {
    return this.actions$.pipe(
      ofType<ActionLogoutRequest>(LoginActionTypes.LOGIN_SUCCESS),
      tap(() => this.router.navigate(['/']))
    );
  }

  @Effect({ dispatch: true })
  logoutRequest() {
    return this.actions$.pipe(
      ofType<ActionLogoutRequest>(LoginActionTypes.LOGOUT_REQUEST),
      map(() => new ActionLogoutSuccess())
    );
  }

  @Effect({ dispatch: true })
  logoutSuccess() {
    return this.actions$.pipe(
      ofType<ActionLogoutSuccess>(LoginActionTypes.LOGOUT_SUCCESS),
      tap(() => this.router.navigate(['/'])),
      map(() => new ActionUserUnauthenticate())
    );
  }
}
