import {UserService} from './user.service';
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {RegisterVm} from './models/view-models/register-vm.model';
import {UserVm} from './models/view-models/user-vm.model';
import {LoginVm} from './models/view-models/login-vm.model';
import {LoginResponseVm} from './models/view-models/login-response-vm.model';

@Injectable()
export class UserApiService {

  constructor(
    protected readonly userService: UserService,
  ) {
  }

  async getUsers(): Promise<UserVm[]> {
    try {
      const unmappedUsers = await this.userService.findAll({});
      const userVmsPromise = this.userService.map<UserVm[]>(unmappedUsers);
      return userVmsPromise;
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


  async register(vm: RegisterVm): Promise<UserVm> {
    const {username, password} = vm;

    if (!username) {
      throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
    }

    if (!password) {
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }

    const unmappedExistingUser = await this.getUserByUsername(username, false);
    if (unmappedExistingUser) {
      throw new HttpException(`${username} exists`, HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.userService.register(vm);
    return this.userService.map<UserVm>(newUser);
  }

  async login(vm: LoginVm): Promise<LoginResponseVm> {
    const fields = Object.keys(vm);
    fields.forEach((field) => {
      if (!vm[field]) {
        throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
      }
    });

    return this.userService.login(vm);
  }

  async updateUser(vm: UserVm): Promise<UserVm> {

    const {
      id,
      firstName,
      lastName,
    } = vm;
    // TODO: allow updating of password and username

    const unmappedExistingUser = await this.userService.findById(id);
    if (!unmappedExistingUser) {
      throw new HttpException(`${id} Not found`, HttpStatus.NOT_FOUND);
    }

    if (firstName) {
      unmappedExistingUser.firstName = firstName;
    }
    if (lastName) {
      unmappedExistingUser.firstName = firstName;
    }

    const unmappedUpdatedUser = await this.userService.update(id, unmappedExistingUser);
    return this.userService.map<UserVm>(unmappedUpdatedUser.toJSON());
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
      console.log('unmappedExistingUser', unmappedExistingUser);
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
      console.log('unmappedExistingUser', unmappedExistingUser);
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
