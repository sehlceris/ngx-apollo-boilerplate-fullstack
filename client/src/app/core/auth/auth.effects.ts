import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BoundLogger, LogService } from "@app/core/services";
import { UserHttpApiService } from "@app/core/services/api/user-http-api.service";
import { LoginWithUsernameGQL } from "@app/generated/anms-graphql-client";
import { Action } from "@ngrx/store";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";

import { LocalStorageService } from "../local-storage/local-storage.service";

import {
  ActionAuthLoginFailure,
  ActionAuthLoginRequest,
  ActionAuthLoginSuccess, ActionAuthLogoutRequest, ActionAuthLogoutSuccess,
  AUTH_KEY,
  AuthActionTypes
} from "./auth.reducer";

@Injectable()
export class AuthEffects {

  private log: BoundLogger = this.logService.bindToNamespace(AuthEffects.name);

  constructor(
    private actions$: Actions<Action>,
    private localStorageService: LocalStorageService,
    private router: Router,
    private userHttpApiService: UserHttpApiService,
    private loginWithUsernameGQL: LoginWithUsernameGQL,
    private logService: LogService
  ) {
  }

  @Effect({ dispatch: true })
  loginRequest() {
    return this.actions$.pipe(
      ofType<ActionAuthLoginRequest>(AuthActionTypes.LOGIN_REQUEST),
      switchMap((action) => this.loginWithUsernameGQL.mutate(action)),
      map((result) => result.data.loginWithUsername),
      map((loginWithUsername) => new ActionAuthLoginSuccess(loginWithUsername.token, loginWithUsername.user)),
      catchError((err) => of(new ActionAuthLoginFailure(err))),
    );
  }

  @Effect({ dispatch: false })
  loginSuccess() {
    return this.actions$.pipe(
      ofType<ActionAuthLoginSuccess>(AuthActionTypes.LOGIN_SUCCESS),
      tap((action) =>
        this.localStorageService.setItem(AUTH_KEY, {
          token: action.token,
          user: action.user
        })
      )
    );
  }

  @Effect({ dispatch: false })
  loginFailure() {
    return this.actions$.pipe(
      ofType<ActionAuthLoginSuccess>(AuthActionTypes.LOGIN_FAILURE),
      tap((action) =>
        this.localStorageService.setItem(AUTH_KEY, {
          token: null,
          user: null
        })
      )
    );
  }

  @Effect({ dispatch: true })
  logoutRequest() {
    return this.actions$.pipe(
      ofType<ActionAuthLogoutRequest>(AuthActionTypes.LOGOUT_REQUEST),
      tap((action) =>
        this.localStorageService.setItem(AUTH_KEY, {
          token: null,
          user: null
        })
      ),
      map(() => new ActionAuthLogoutSuccess())
    );
  }

  @Effect({ dispatch: false })
  logoutSuccess() {
    return this.actions$.pipe(
      ofType<ActionAuthLogoutSuccess>(AuthActionTypes.LOGOUT_SUCCESS),
      tap((action) =>
        this.router.navigate(['/'])
      )
    );
  }
}
