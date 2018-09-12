import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '@app/app.config';
import {UserVm} from '../../../../../../server/src/user/models/view-models/user-vm.model';
import {BoundLogger, LogService} from '@app/core/services';


@Injectable()
export class UserHttpApiService {

  private log: BoundLogger = this.logService.bindToNamespace('UserHttpApiService');

  constructor(
    private httpClient: HttpClient,
    private logService: LogService,
  ) {

  }

  loginWithUsername(username: string, password: string) {
    this.httpClient.post<UserVm>(`${AppConfig.BaseHttpUrl}/loginWithUsername`, {
      username,
      password
    })
      .pipe(
        this.log.tapObservableForLogging('loginWithUsername'),
      )
      .subscribe((user: UserVm) => {
        console.log('login successful', user);
      });
  }
}
