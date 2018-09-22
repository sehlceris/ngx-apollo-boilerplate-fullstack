import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { LoginEffects } from '@app/core/auth/login/login.effects';
import { RegisterEffects } from '@app/core/auth/register/register.effects';
import { UserEffects } from '@app/core/auth/user/user.effects';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { storeFreeze } from 'ngrx-store-freeze';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { environment } from '@env/environment';

import { debug } from './meta-reducers/debug.reducer';
import { initStateFromLocalStorage } from './meta-reducers/init-state-from-local-storage.reducer';
import { LocalStorageService } from './local-storage/local-storage.service';
import { authReducer } from './auth/auth.reducer';
import { AuthEffects } from './auth/auth.effects';
import { AuthGuardService } from './auth/auth-guard.service';
import { AnimationsService } from './animations/animations.service';
import { TitleService } from './services/title.service';
import { DomAbstractionService } from '@app/core/services/dom-abstraction.service';
import { FormValidationService } from '@app/core/services/form-validation.service';
import { LogService } from '@app/core/services/log.service';
import { LoadingOverlayComponent } from '@app/core/shared/loading-overlay/loading-overlay.component';
import { LoadingOverlayService } from '@app/core/shared/loading-overlay/loading-overlay.service';
import { SharedModule } from '@app/shared';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { UserHttpApiService } from '@app/core/services/api/user-http-api.service';
import { AuthModule } from '@app/core/auth/auth.module';

export const metaReducers: MetaReducer<any>[] = [initStateFromLocalStorage];

if (!environment.production) {
  metaReducers.unshift(storeFreeze);
  if (!environment.test) {
    metaReducers.unshift(debug);
  }
}

const SERVICES = [
  DomAbstractionService,
  FormValidationService,
  LogService,
  LocalStorageService,
  AuthGuardService,
  AnimationsService,
  TitleService,
  LoadingOverlayService,
  UserHttpApiService,
];

const COMPONENTS = [LoadingOverlayComponent];

@NgModule({
  imports: [
    // angular
    CommonModule,
    HttpClientModule,

    // shared module
    SharedModule,

    // core modules
    AuthModule,

    // ngrx
    StoreModule.forRoot(
      {
        auth: authReducer,
      },
      {
        metaReducers,
      }
    ),
    EffectsModule.forRoot([LoginEffects, UserEffects, RegisterEffects]),
    StoreRouterConnectingModule,

    environment.envName === 'DEV'
      ? StoreDevtoolsModule.instrument({
          maxAge: 20,
        })
      : [],

    // 3rd party
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [...COMPONENTS],
  providers: [...SERVICES],
  exports: [TranslateModule, ...COMPONENTS],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/`,
    '.json'
  );
}
