import { Injectable } from '@angular/core';
import { LocalStorageService } from '@app/core/local-storage/local-storage.service';
import {
  ActionUserAuthenticate,
  ActionUserUnauthenticate,
  USER_KEY,
  UserActionTypes,
} from '@app/core/auth/user/user.reducer';
import { BoundLogger, LogService } from '@app/core/services';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { tap } from 'rxjs/operators';

@Injectable()
export class UserEffects {
  private log: BoundLogger = this.logService.bindToNamespace(UserEffects.name);

  constructor(
    private actions$: Actions<Action>,
    private localStorageService: LocalStorageService,
    private logService: LogService
  ) {}

  @Effect({ dispatch: false })
  authenticate() {
    return this.actions$.pipe(
      ofType<ActionUserAuthenticate>(UserActionTypes.AUTHENTICATE),
      tap((action) =>
        this.localStorageService.setItem(USER_KEY, {
          token: action.token,
          user: action.user,
        })
      )
    );
  }

  @Effect({ dispatch: false })
  unauthenticate() {
    return this.actions$.pipe(
      ofType<ActionUserUnauthenticate>(UserActionTypes.UNAUTHENTICATE),
      tap(() =>
        this.localStorageService.setItem(USER_KEY, {
          token: null,
          user: null,
        })
      )
    );
  }
}
