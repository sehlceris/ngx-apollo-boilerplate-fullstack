import {Args, Mutation, Resolver} from '@nestjs/graphql';
import {UserApiService} from './user-api.service';
import {UserVm} from './models/view-models/user-vm.model';
import {RegisterVm} from './models/view-models/register-vm.model';
import {LoginVm} from './models/view-models/login-vm.model';
import {LoginResponseVm} from './models/view-models/login-response-vm.model';

@Resolver('User')
export class UserResolvers {
  constructor(
    protected readonly userApiService: UserApiService,
  ) {}

  @Mutation()
  async register(
    @Args() vm: RegisterVm,
  ): Promise<UserVm> {
    return this.userApiService.register(vm);
  }

  @Mutation()
  async login(
    @Args() vm: LoginVm,
  ): Promise<LoginResponseVm> {
    return this.userApiService.login(vm);
  }
}
