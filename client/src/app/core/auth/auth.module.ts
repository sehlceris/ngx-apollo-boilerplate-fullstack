import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/index';

import { AboutComponent } from './about/about.component';
import { AuthRoutingModule } from '@app/core/auth/auth-routing.module';
import { LoginComponent } from '@app/core/auth/login/login.component';
import { RegisterComponent } from '@app/core/auth/register/register.component';
import { ForgotPasswordComponent } from '@app/core/auth/forgot-password/forgot-password.component';
import { AuthComponent } from '@app/core/auth/auth.component';
import { ForgotPasswordResetByEmailFormComponent } from '@app/core/auth/forgot-password/forgot-password-form/forgot-password-reset-by-email-form.component';

const COMPONENTS = [
  AuthComponent,
  LoginComponent,
  RegisterComponent,
  ForgotPasswordComponent,
  ForgotPasswordResetByEmailFormComponent,
];

@NgModule({
  imports: [SharedModule, AuthRoutingModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class AuthModule {}
