import { Injectable } from '@angular/core';
import { UserHttpApiService } from '@app/core/services/api/user-http-api.service';
import {
  LoginWithUsername,
  LoginWithUsernameGQL,
} from '@app/generated/anms-graphql-client';
import { map, tap } from 'rxjs/operators';
import { ExecutionResult } from 'apollo-link';
import { Observable } from 'rxjs';
import { BoundLogger, LogService } from '@app/core/services';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private log: BoundLogger = this.logService.bindToNamespace(AuthService.name);

  constructor(
    private userHttpApiService: UserHttpApiService,
    private loginWithUsernameGQL: LoginWithUsernameGQL,
    private logService: LogService
  ) {}

  loginWithUsername(
    username: string,
    password: string
  ): Observable<LoginWithUsername.LoginWithUsername> {
    return this.loginWithUsernameGQL
      .mutate({
        username,
        password,
      })
      .pipe(
        this.log.tapObservableForLogging(this.loginWithUsername.name),
        map((result: ExecutionResult) => {
          const loginWithUsername = <LoginWithUsername.LoginWithUsername>(
            result.data.loginWithUsername
          );
          return loginWithUsername;
        }),
        tap((loginWithUsername: LoginWithUsername.LoginWithUsername) => {
          this.log.debug(`TODO: put this in store`);
        })
      );
  }
}
