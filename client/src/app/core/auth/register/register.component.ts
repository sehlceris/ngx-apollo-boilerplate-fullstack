import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ActionRegisterRequest,
  RegisterState,
  selectorRegister,
} from '@app/core/auth/register/register.reducer';
import { LoadingOverlayService } from '@app/core/shared/loading-overlay/loading-overlay.service';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RegisterVm } from '../../../../../../server/src/user/models/view-models/register-vm.model';

const REGISTER_COMPONENT_LOADING_OVERLAY_LOADING_REF =
  'REGISTER_COMPONENT_LOADING_OVERLAY_LOADING_REF';

@Component({
  selector: 'anms-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup = null;
  registerError: string = null;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<any>,
    private loadingOverlayService: LoadingOverlayService
  ) {}

  ngOnInit() {
    this.initRegisterForm();

    this.store
      .pipe(
        select(selectorRegister),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((register: RegisterState) => {
        if (register.registering) {
          this.loadingOverlayService.pushOrEditLoadingScreen(
            REGISTER_COMPONENT_LOADING_OVERLAY_LOADING_REF,
            'Registering...'
          );
        } else {
          this.loadingOverlayService.removeLoadingScreen(
            REGISTER_COMPONENT_LOADING_OVERLAY_LOADING_REF
          );
        }
        this.registerError = register.registerError;
      });
  }

  ngOnDestroy() {
    this.loadingOverlayService.removeLoadingScreen(
      REGISTER_COMPONENT_LOADING_OVERLAY_LOADING_REF
    );
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onRegisterFormSubmit() {
    if (this.registerForm.valid) {
      const registerVm: RegisterVm = this.registerForm.value;
      this.store.dispatch(new ActionRegisterRequest(registerVm));
    }
  }

  private initRegisterForm() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
}
