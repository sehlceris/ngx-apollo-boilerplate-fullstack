import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {RegistrationService} from './registration.service';
import {UserVm} from '../user/models/view-models/user-vm.model';
import {User} from '../user/models/user.model';
import {Registration, RegistrationModel} from './models/registration.model';
import {ConfirmUserVm} from './models/view-models/confirm-user-vm.model';

@Injectable()
export class RegistrationApiService {
  constructor(
    protected readonly registrationService: RegistrationService
  ) {}

  async createRegistrationConfirmationForUser(user: User) {
    const newRegistration = new RegistrationModel();
    newRegistration.userId = user.id;
    const result = await this.registrationService.create(newRegistration);
    return result.toJSON() as Registration;
  }

  async confirmUser(vm: ConfirmUserVm): Promise<UserVm> {
    return null;
  }
}
