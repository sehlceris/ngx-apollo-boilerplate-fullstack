import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActionResetPasswordByEmail } from '@app/core/auth/forgot-password/forgot-password.reducer';
import { AbstractForgotPasswordFormComponent } from '@app/core/auth/forgot-password/forgot-password-form/abstract-forgot-password-form.component';

@Component({
  selector: 'anms-forgot-password-reset-by-email-form',
  templateUrl: './forgot-password-reset-by-email-form.html',
  styleUrls: ['./forgot-password-form.component.scss'],
})
export class ForgotPasswordResetByEmailFormComponent extends AbstractForgotPasswordFormComponent {
  onForgotPasswordFormSubmit() {
    if (this.forgotPasswordForm.valid) {
      const resetPasswordVm: any = this.forgotPasswordForm.value;
      this.store.dispatch(
        new ActionResetPasswordByEmail(resetPasswordVm.email)
      );
    }
  }

  initForgotPasswordForm() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
}
