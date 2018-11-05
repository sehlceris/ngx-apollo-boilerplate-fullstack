import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { LoadingOverlayService } from '@app/core/shared/loading-overlay/loading-overlay.service';
import { skip, takeUntil } from 'rxjs/operators';
import { ForgotPasswordState, selectorForgotPassword } from '@app/core/auth/forgot-password/forgot-password.reducer';

const FORGOT_PASSWORD_COMPONENT_LOADING_OVERLAY_LOADING_REF = 'FORGOT_PASSWORD_COMPONENT_LOADING_OVERLAY_LOADING_REF';

@Injectable()
export abstract class AbstractGenerateResetTokenFormComponent implements OnInit, OnDestroy {
  forgotPasswordForm: FormGroup = null;
  forgotPasswordError: string = null;

  protected unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    protected fb: FormBuilder,
    protected store: Store<any>,
    protected loadingOverlayService: LoadingOverlayService,
  ) {}

  ngOnInit() {
    this.initForgotPasswordForm();

    this.store
      .pipe(
        select(selectorForgotPassword),
        takeUntil(this.unsubscribe$),
        skip(1),
      )
      .subscribe((forgotPassword: ForgotPasswordState) => {
        if (forgotPassword.generatingToken || forgotPassword.submittingReset) {
          this.loadingOverlayService.pushOrEditLoadingScreen(
            FORGOT_PASSWORD_COMPONENT_LOADING_OVERLAY_LOADING_REF,
            'Submitting password reset request...',
          );
        } else {
          this.loadingOverlayService.removeLoadingScreen(FORGOT_PASSWORD_COMPONENT_LOADING_OVERLAY_LOADING_REF);
        }
        this.forgotPasswordError = forgotPassword.generateResetTokenError || forgotPassword.resetPasswordError || null;
      });
  }

  ngOnDestroy() {
    this.loadingOverlayService.removeLoadingScreen(FORGOT_PASSWORD_COMPONENT_LOADING_OVERLAY_LOADING_REF);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  abstract onForgotPasswordFormSubmit();
  abstract initForgotPasswordForm();
}
