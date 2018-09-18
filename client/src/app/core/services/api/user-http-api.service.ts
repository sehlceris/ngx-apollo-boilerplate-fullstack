import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '@app/app.config';
import { UserVm } from '../../../../../../server/src/user/models/view-models/user-vm.model';
import { BoundLogger, LogService } from '@app/core/services';

const USERS_BASE_URI = `${AppConfig.BaseHttpUrl}/users`;

/**
 * This is a sample HTTP API service in case you want to use REST instead of GraphQL
 */
@Injectable()
export class UserHttpApiService {

  private log: BoundLogger = this.logService.bindToNamespace(UserHttpApiService.name);

  constructor(
    private httpClient: HttpClient,
    private logService: LogService
  ) {}

  loginWithUsername(username: string, password: string) {
    return this.httpClient.post<UserVm>(`${USERS_BASE_URI}/loginWithUsername`, {
      username,
      password,
    });
  }
}
