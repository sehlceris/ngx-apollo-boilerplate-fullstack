import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActionLoginWithUsernameRequest, LoginState, selectorLogin} from '@app/core/auth/login/login.reducer';
import {LoadingOverlayService} from '@app/core/shared/loading-overlay/loading-overlay.service';
import {select, Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {skip, takeUntil} from 'rxjs/operators';
import {LoginWithUsernameVm} from '../../../../../../server/src/user/models/view-models/login-vm.model';

const LOGIN_COMPONENT_LOADING_OVERLAY_LOADING_REF = 'LOGIN_COMPONENT_LOADING_OVERLAY_LOADING_REF';

@Component({
  selector: 'anms-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup = null;
  loginError: string = null;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<any>,
    private loadingOverlayService: LoadingOverlayService,
  ) {}

  ngOnInit() {
    this.initLoginForm();

    this.store
      .pipe(
        select(selectorLogin),
        takeUntil(this.unsubscribe$),
        skip(1),
      )
      .subscribe((login: LoginState) => {
        if (login.loggingIn) {
          this.loadingOverlayService.pushOrEditLoadingScreen(LOGIN_COMPONENT_LOADING_OVERLAY_LOADING_REF, 'Loading...');
        } else {
          this.loadingOverlayService.removeLoadingScreen(LOGIN_COMPONENT_LOADING_OVERLAY_LOADING_REF);
        }
        this.loginError = login.loginError;
      });
  }

  ngOnDestroy() {
    this.loadingOverlayService.removeLoadingScreen(LOGIN_COMPONENT_LOADING_OVERLAY_LOADING_REF);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onLoginFormSubmit() {
    if (this.loginForm.valid) {
      const loginVm: LoginWithUsernameVm = this.loginForm.value;
      this.store.dispatch(new ActionLoginWithUsernameRequest(loginVm.username, loginVm.password));
    }
  }

  private initLoginForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
}
