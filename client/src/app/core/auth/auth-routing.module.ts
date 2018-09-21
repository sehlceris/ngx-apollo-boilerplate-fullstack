import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from '@app/core/auth/auth.component';
import { LoginComponent } from '@app/core/auth/login/login.component';
import { ForgotPasswordComponent } from '@app/core/auth/forgot-password/forgot-password.component';
import { RegisterComponent } from '@app/core/auth/register/register.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    data: { title: 'anms.menu.auth' },
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
        data: { title: 'anms.auth.login' },
      },
      {
        path: 'register',
        component: RegisterComponent,
        data: { title: 'anms.auth.register' },
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: { title: 'anms.auth.forgot' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
