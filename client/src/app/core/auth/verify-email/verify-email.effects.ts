import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BoundLogger, LogService} from '@app/core/services';
import {VerifyEmailGQL} from '@app/generated/anms-graphql-client';
import {Action} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of, pipe} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {ActionVerifyEmail, VerifyEmailActionTypes} from '@app/core/auth/verify-email/verify-email.reducer';

@Injectable()
export class VerifyEmailEffects {
  private log: BoundLogger = this.logService.bindToNamespace(VerifyEmailEffects.name);

  constructor(
    private actions$: Actions<Action>,
    private router: Router,
    private verifyEmailGql: VerifyEmailGQL,
    private logService: LogService,
  ) {}

  @Effect({dispatch: false})
  verifyEmail() {
    return this.actions$.pipe(
      ofType<ActionVerifyEmail>(VerifyEmailActionTypes.VERIFY_EMAIL),
      pipe(
        switchMap((action: ActionVerifyEmail) => {
          this.log.error('verifying email!');
          return this.verifyEmailGql.mutate();
        }),
        tap(
          () => {
            this.log.error('ATTEMPTED TO MUTATE AND SUCCEEDED');
          },
          (err) => {
            this.log.error('ATTEMPTED TO MUTATE AND FAILED: ' + err);
          },
        ),
      ),
    );
  }
}
