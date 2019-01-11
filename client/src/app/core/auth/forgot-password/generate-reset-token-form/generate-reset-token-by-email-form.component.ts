import {Component} from '@angular/core';
import {Validators} from '@angular/forms';
import {ActionGenerateResetTokenByEmail} from '@app/core/auth/forgot-password/forgot-password.reducer';
import {AbstractGenerateResetTokenFormComponent} from '@app/core/auth/forgot-password/generate-reset-token-form/abstract-generate-reset-token-form.component';

@Component({
  selector: 'anms-generate-reset-token-by-email-form',
  templateUrl: './generate-reset-token-by-email-form.html',
  styleUrls: ['./generate-reset-token-form.component.scss'],
})
export class GenerateResetTokenByEmailFormComponent extends AbstractGenerateResetTokenFormComponent {
  onForgotPasswordFormSubmit() {
    if (this.forgotPasswordForm.valid) {
      const resetPasswordVm: any = this.forgotPasswordForm.value;
      this.store.dispatch(new ActionGenerateResetTokenByEmail(resetPasswordVm.email));
    }
  }

  initForgotPasswordForm() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
}
