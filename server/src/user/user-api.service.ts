import {UserService} from './user.service';
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {RegisterVm} from './models/view-models/register-vm.model';
import {UserVm} from './models/view-models/user-vm.model';
import {LoginVm} from './models/view-models/login-vm.model';
import {LoginResponseVm} from './models/view-models/login-response-vm.model';

@Injectable()
export class UserApiService {

  constructor(
    protected readonly userService: UserService
  ) {}

  async register(vm: RegisterVm): Promise<UserVm> {
    const { username, password } = vm;

    if (!username) {
      throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
    }

    if (!password) {
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }

    let exist;
    try {
      exist = await this.userService.findOne({ username });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (exist) {
      throw new HttpException(`${username} exists`, HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.userService.register(vm);
    return this.userService.map<UserVm>(newUser);
  }

  async login( vm: LoginVm): Promise<LoginResponseVm> {
    const fields = Object.keys(vm);
    fields.forEach((field) => {
      if (!vm[field]) {
        throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
      }
    });

    return this.userService.login(vm);
  }
}
