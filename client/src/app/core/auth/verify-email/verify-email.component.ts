import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Subject} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {LoadingOverlayService} from '@app/core/shared/loading-overlay/loading-overlay.service';

const VERIFY_EMAIL_COMPONENT_LOADING_OVERLAY_LOADING_REF = 'VERIFY_EMAIL_COMPONENT_LOADING_OVERLAY_LOADING_REF';

@Component({
  selector: 'anms-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  verifyEmailError: string = null;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<any>,
    private loadingOverlayService: LoadingOverlayService,
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.loadingOverlayService.removeLoadingScreen(VERIFY_EMAIL_COMPONENT_LOADING_OVERLAY_LOADING_REF);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
