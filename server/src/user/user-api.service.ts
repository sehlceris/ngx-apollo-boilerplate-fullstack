import {UserService} from './user.service';
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {RegisterVm} from './models/view-models/register-vm.model';
import {UserVm} from './models/view-models/user-vm.model';
import {LoginWithEmailVm, LoginWithIdVm, LoginWithUsernameVm} from './models/view-models/login-vm.model';
import {LoginResponseVm} from './models/view-models/login-response-vm.model';

@Injectable()
export class UserApiService {

  constructor(
    protected readonly userService: UserService,
  ) {
  }

  async getUsers(filter: Partial<UserVm> = {}): Promise<UserVm[]> {
    try {
      const unmappedUsers = await this.userService.findAll({});
      return this.userService.map<UserVm[]>(unmappedUsers.map(u => u.toJSON()));
    }
    catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserById(id: string, throwIfNotFound: boolean = true): Promise<UserVm> {
    if (!id) {
      throw new HttpException('No ID provided', HttpStatus.BAD_REQUEST);
    }
    return this.getExistingUserById(id, throwIfNotFound);
  }

  async getUserByUsername(username: string, throwIfNotFound: boolean = true): Promise<UserVm> {
    if (!username) {
      throw new HttpException('No username provided', HttpStatus.BAD_REQUEST);
    }
    return this.getExistingUserByFilter({username: username}, throwIfNotFound);
  }

  async getUserByEmail(email: string, throwIfNotFound: boolean = true): Promise<UserVm> {
    if (!email) {
      throw new HttpException('No email provided', HttpStatus.BAD_REQUEST);
    }
    return this.getExistingUserByFilter({email: email}, throwIfNotFound);
  }


  async register(vm: RegisterVm): Promise<UserVm> {
    const {username, email, password} = vm;

    if (!username) {
      throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
    }

    if (!email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }

    if (!password) {
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }

    let unmappedExistingUser;

    unmappedExistingUser = await this.getUserByUsername(username, false);
    if (unmappedExistingUser) {
      throw new HttpException(`Username ${username} already registered`, HttpStatus.BAD_REQUEST);
    }

    unmappedExistingUser = await this.getUserByEmail(email, false);
    if (unmappedExistingUser) {
      throw new HttpException(`Email ${email} already registered`, HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.userService.register(vm);
    return this.userService.map<UserVm>(newUser);
  }

  async loginWithUsername(vm: LoginWithUsernameVm): Promise<LoginResponseVm> {
    const fields = Object.keys(vm);
    fields.forEach((field) => {
      if (!vm[field]) {
        throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
      }
    });

    return this.userService.loginWithUsername(vm);
  }

  async loginWithEmail(vm: LoginWithEmailVm): Promise<LoginResponseVm> {
    const fields = Object.keys(vm);
    fields.forEach((field) => {
      if (!vm[field]) {
        throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
      }
    });

    return this.userService.loginWithEmail(vm);
  }

  async loginWithId(vm: LoginWithIdVm): Promise<LoginResponseVm> {
    const fields = Object.keys(vm);
    fields.forEach((field) => {
      if (!vm[field]) {
        throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
      }
    });

    return this.userService.loginWithId(vm);
  }

  async updateUser(vm: UserVm): Promise<UserVm> {

    const {
      id,
      email,
    } = vm;

    const unmappedExistingUser = await this.userService.findById(id);
    if (!unmappedExistingUser) {
      throw new HttpException(`${id} Not found`, HttpStatus.NOT_FOUND);
    }

    if (email) {
      unmappedExistingUser.email = email;
    }

    const unmappedUpdatedUser = await this.userService.update(id, unmappedExistingUser);
    return this.userService.map<UserVm>(unmappedUpdatedUser.toJSON());
  }

  async updatePasswordById(id: string, currentPassword: string, newPassword: string): Promise<UserVm> {
    await this.userService.loginWithId({
      id,
      password: currentPassword
    });
    return this.userService.updatePasswordById(id, newPassword);
  }

  async deleteUserById(id: string): Promise<UserVm> {
    const unmappedDeletedUser = await this.userService.delete(id);
    if (!unmappedDeletedUser) {
      throw new HttpException(`${id} Not found`, HttpStatus.BAD_REQUEST);
    }
    return this.userService.map<UserVm>(unmappedDeletedUser.toJSON());
  }

  private async getExistingUserByFilter(filter: Partial<UserVm>, throwIfNotFound: boolean = true): Promise<UserVm> {
    try {
      const unmappedExistingUser = await this.userService.findOne(filter);
      if (!unmappedExistingUser) {
        if (throwIfNotFound === false) {
          return null;
        }
        throw new HttpException(`user ${JSON.stringify(filter)} does not exist`, HttpStatus.BAD_REQUEST);
      }
      const userVmPromise = this.userService.map<UserVm>(unmappedExistingUser.toJSON());
      return userVmPromise;
    }
    catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async getExistingUserById(id: string, throwIfNotFound: boolean = true): Promise<UserVm> {
    try {
      const unmappedExistingUser = await this.userService.findById(id);
      if (!unmappedExistingUser) {
        if (throwIfNotFound === false) {
          return null;
        }
        throw new HttpException(`user ${id} does not exist`, HttpStatus.BAD_REQUEST);
      }
      const userVmPromise = this.userService.map<UserVm>(unmappedExistingUser.toJSON());
      return userVmPromise;
    }
    catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
