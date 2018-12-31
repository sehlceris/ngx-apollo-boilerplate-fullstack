import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BoundLogger, LogService} from '@app/core/services';
import {Action} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {map} from 'rxjs/operators';
import {ActionVerifyEmail, VerifyEmailActionTypes} from '@app/core/auth/verify-email/verify-email.reducer';

@Injectable()
export class ForgotPasswordEffects {
  private log: BoundLogger = this.logService.bindToNamespace(ForgotPasswordEffects.name);

  constructor(private actions$: Actions<Action>, private router: Router, private logService: LogService) {}

  @Effect({dispatch: true})
  verifyEmail(token) {
    return this.actions$.pipe(
      ofType<ActionVerifyEmail>(VerifyEmailActionTypes.VERIFY_EMAIL),
      map((action) => {
        return new ActionVerifyEmail(token);
      }),
    );
  }
}
