import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { LoadingOverlayService } from '@app/core/shared/loading-overlay/loading-overlay.service';
import { skip, takeUntil } from 'rxjs/operators';
import { ForgotPasswordState, selectorForgotPassword } from '@app/core/auth/forgot-password/forgot-password.reducer';

export enum PasswordRecoveryMethod {
  Email = 'Email',
  TextMessage = 'TextMessage',
}

const FORGOT_PASSWORD_COMPONENT_LOADING_OVERLAY_LOADING_REF = 'FORGOT_PASSWORD_COMPONENT_LOADING_OVERLAY_LOADING_REF';

@Component({
  selector: 'anms-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  PasswordRecoveryMethod = PasswordRecoveryMethod;

  forgotPasswordError: string = null;
  recoveryMethod: PasswordRecoveryMethod = PasswordRecoveryMethod.Email;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<any>,
    private loadingOverlayService: LoadingOverlayService,
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.loadingOverlayService.removeLoadingScreen(FORGOT_PASSWORD_COMPONENT_LOADING_OVERLAY_LOADING_REF);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
