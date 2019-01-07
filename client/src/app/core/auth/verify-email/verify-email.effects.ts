import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BoundLogger, LogService} from '@app/core/services';
import {VerifyEmailGQL} from '@app/generated/anms-graphql-client';
import {Action} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of, pipe} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {
  ActionVerifyEmail,
  ActionVerifyEmailFailure,
  ActionVerifyEmailSuccess,
  VerifyEmailActionTypes,
} from '@app/core/auth/verify-email/verify-email.reducer';
import {HttpHeaders} from '@angular/common/http';

@Injectable()
export class VerifyEmailEffects {
  private log: BoundLogger = this.logService.bindToNamespace(VerifyEmailEffects.name);

  constructor(
    private actions$: Actions<Action>,
    private router: Router,
    private verifyEmailGql: VerifyEmailGQL,
    private logService: LogService,
  ) {}

  @Effect({dispatch: true})
  verifyEmail() {
    return this.actions$.pipe(
      ofType<ActionVerifyEmail>(VerifyEmailActionTypes.VERIFY_EMAIL),
      pipe(
        switchMap((action: ActionVerifyEmail) => {
          return this.verifyEmailGql.mutate(undefined, {
            context: {
              headers: new HttpHeaders({
                Authorization: `Bearer ${action.payload}`,
              }),
            },
          });
        }),
        map(() => {
          return new ActionVerifyEmailSuccess();
        }),
        catchError((err) => {
          return of(new ActionVerifyEmailFailure(err));
        }),
      ),
    );
  }
}
