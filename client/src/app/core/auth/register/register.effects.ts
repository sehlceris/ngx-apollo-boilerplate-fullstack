import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionRegisterFailure,
  ActionRegisterRequest,
  ActionRegisterSuccess,
  RegisterActionTypes,
} from '@app/core/auth/register/register.reducer';
import { BoundLogger, LogService } from '@app/core/services';
import { RegisterGQL } from '@app/generated/anms-graphql-client';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class RegisterEffects {
  private log: BoundLogger = this.logService.bindToNamespace(RegisterEffects.name);

  constructor(
    private actions$: Actions<Action>,
    private router: Router,
    private registerGQL: RegisterGQL,
    private logService: LogService,
  ) {}

  @Effect({ dispatch: true })
  registerRequest() {
    return this.actions$.pipe(
      ofType<ActionRegisterRequest>(RegisterActionTypes.REGISTER_REQUEST),
      switchMap((action) => {
        return this.registerGQL.mutate(action.data).pipe(
          map(() => new ActionRegisterSuccess()),
          catchError((err) => of(new ActionRegisterFailure(err))),
        );
      }),
    );
  }

  @Effect({ dispatch: false })
  registerSuccess() {
    return this.actions$.pipe(
      ofType<ActionRegisterSuccess>(RegisterActionTypes.REGISTER_SUCCESS),
      tap(() => this.router.navigate(['/auth', 'login'])),
    );
  }
}
