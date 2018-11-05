import { ActionLoginWithUsernameRequest, ActionLogoutRequest } from '@app/core/auth/login/login.reducer';
import { selectorUser } from '@app/core/auth/user/user.reducer';
import { BoundLogger, LogService } from '@app/core/services';
import browser from 'browser-detect';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { AnimationsService, TitleService, routeAnimations } from '@app/core';
import { environment as env } from '@env/environment';

import {
  NIGHT_MODE_THEME,
  selectorSettings,
  SettingsState,
  ActionSettingsPersist,
  ActionSettingsChangeLanguage,
  ActionSettingsChangeAnimationsPageDisabled,
} from './settings';

@Component({
  selector: 'anms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations],
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();

  @HostBinding('class')
  componentCssClass;

  isProd = env.production;
  envName = env.envName;
  version = env.versions.app;
  year = new Date().getFullYear();
  logo = require('../assets/logo.png');
  languages = ['en', 'sk'];
  navigation = [
    { link: 'tasks', label: 'anms.menu.tasks' },
    { link: 'about', label: 'anms.menu.about' },
    { link: 'examples', label: 'anms.menu.examples' },
  ];
  navigationSideMenu = [...this.navigation, { link: 'settings', label: 'anms.menu.settings' }];

  settings: SettingsState;
  isAuthenticated: boolean;

  private log: BoundLogger = this.logService.bindToNamespace(AppComponent.name);

  constructor(
    public overlayContainer: OverlayContainer,
    private store: Store<any>,
    private router: Router,
    private titleService: TitleService,
    private animationService: AnimationsService,
    private translate: TranslateService,
    private logService: LogService,
  ) {}

  private static trackPageView(event: NavigationEnd) {
    (<any>window).ga('set', 'page', event.urlAfterRedirects);
    (<any>window).ga('send', 'pageview');
  }

  private static isIEorEdge() {
    return ['ie', 'edge'].includes(browser().name);
  }

  ngOnInit(): void {
    this.translate.setDefaultLang('en');
    this.subscribeToSettings();
    this.subscribeToIsAuthenticated();
    this.subscribeToRouterEvents();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onLogoutClick() {
    this.store.dispatch(new ActionLogoutRequest());
  }

  onLanguageSelect({ value: language }) {
    this.store.dispatch(new ActionSettingsChangeLanguage({ language }));
    this.store.dispatch(new ActionSettingsPersist({ settings: this.settings }));
  }

  private subscribeToIsAuthenticated() {
    this.store
      .pipe(
        select(selectorUser),
        takeUntil(this.unsubscribe$),
      )
      .subscribe((user) => (this.isAuthenticated = !!user.token));
  }

  private subscribeToSettings() {
    if (AppComponent.isIEorEdge()) {
      this.store.dispatch(
        new ActionSettingsChangeAnimationsPageDisabled({
          pageAnimationsDisabled: true,
        }),
      );
    }
    this.store
      .pipe(
        select(selectorSettings),
        takeUntil(this.unsubscribe$),
      )
      .subscribe((settings) => {
        this.settings = settings;
        this.setTheme(settings);
        this.setLanguage(settings);
        this.animationService.updateRouteAnimationType(settings.pageAnimations, settings.elementsAnimations);
      });
  }

  private setTheme(settings: SettingsState) {
    const { theme, autoNightMode } = settings;
    const hours = new Date().getHours();
    const effectiveTheme = (autoNightMode && (hours >= 20 || hours <= 6) ? NIGHT_MODE_THEME : theme).toLowerCase();
    this.componentCssClass = effectiveTheme;
    const classList = this.overlayContainer.getContainerElement().classList;
    const toRemove = Array.from(classList).filter((item: string) => item.includes('-theme'));
    if (toRemove.length) {
      classList.remove(...toRemove);
    }
    classList.add(effectiveTheme);
  }

  private setLanguage(settings: SettingsState) {
    const { language } = settings;
    if (language) {
      this.translate.use(language);
    }
  }

  private subscribeToRouterEvents() {
    this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
      if (event instanceof ActivationEnd) {
        this.titleService.setTitle(event.snapshot);
      }

      if (event instanceof NavigationEnd) {
        AppComponent.trackPageView(event);
      }
    });
  }
}
