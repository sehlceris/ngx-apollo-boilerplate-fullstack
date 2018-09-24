import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BoundLogger, LogService } from '@app/core/services';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  ActionGenerateResetTokenByEmail,
  ActionGenerateResetTokenByTextMessage,
  ActionGenerateResetTokenByEmailFailure,
  ForgotPasswordActionTypes,
} from '@app/core/auth/forgot-password/forgot-password.reducer';

@Injectable()
export class ForgotPasswordEffects {
  private log: BoundLogger = this.logService.bindToNamespace(
    ForgotPasswordEffects.name
  );

  constructor(
    private actions$: Actions<Action>,
    private router: Router,
    private logService: LogService
  ) {}

  @Effect({ dispatch: true })
  resetPasswordByEmail() {
    return this.actions$.pipe(
      ofType<ActionGenerateResetTokenByEmail>(
        ForgotPasswordActionTypes.GENERATE_RESET_TOKEN_BY_EMAIL
      ),
      map((action) => {
        return new ActionGenerateResetTokenByEmailFailure(
          'Resetting your password is not yet supported'
        );
      })
    );
  }

  @Effect({ dispatch: true })
  resetPasswordByTextMessage() {
    return this.actions$.pipe(
      ofType<ActionGenerateResetTokenByTextMessage>(
        ForgotPasswordActionTypes.GENERATE_RESET_TOKEN_BY_TEXT_MESSAGE
      ),
      map((action) => {
        return new ActionGenerateResetTokenByEmailFailure(
          'Resetting your password is not yet supported'
        );
      })
    );
  }
}
