import {Component, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Observable, Subject} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {LoadingOverlayService} from '@app/core/shared/loading-overlay/loading-overlay.service';
import {ActivatedRoute} from '@angular/router';
import {BoundLogger, LogService} from '@app/core/services';
import {filter, map, takeUntil} from 'rxjs/operators';
import {
  ActionVerifyEmail,
  ActionVerifyEmailCancel,
  selectorVerifyEmail,
  VerifyEmailState,
  VerifyState,
} from '@app/core/auth/verify-email/verify-email.reducer';

const VERIFY_EMAIL_COMPONENT_LOADING_OVERLAY_LOADING_REF = 'VERIFY_EMAIL_COMPONENT_LOADING_OVERLAY_LOADING_REF';

@Component({
  selector: 'anms-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  public VerifyState = VerifyState;
  public state$: Observable<VerifyEmailState>;

  private log: BoundLogger = this.logService.bindToNamespace(VerifyEmailComponent.name);

  verifyEmailError: string = null;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private store: Store<any>,
    private loadingOverlayService: LoadingOverlayService,
    private route: ActivatedRoute,
    private logService: LogService,
  ) {}

  ngOnInit() {
    this.state$ = this.store.pipe(select(selectorVerifyEmail));
    this.watchQueryParamsForToken();
  }

  ngOnDestroy() {
    this.loadingOverlayService.removeLoadingScreen(VERIFY_EMAIL_COMPONENT_LOADING_OVERLAY_LOADING_REF);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.store.dispatch(new ActionVerifyEmailCancel());
  }

  watchQueryParamsForToken() {
    const verifyState$: Observable<VerifyState> = this.state$.pipe(map((state: VerifyEmailState) => state.verifyState));

    const tokenFromQueryParams$: Observable<string> = this.route.queryParams.pipe(map((params: any) => params.token));

    combineLatest(verifyState$, tokenFromQueryParams$)
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(
          ([verifyState, token]: [VerifyState, string]) => verifyState === VerifyState.PRE_VERIFICATION && !!token,
        ),
        map(([verifyState, token]: [VerifyState, string]) => token),
      )
      .subscribe((token: string) => {
        this.store.dispatch(new ActionVerifyEmail(token));
      });
  }
}
