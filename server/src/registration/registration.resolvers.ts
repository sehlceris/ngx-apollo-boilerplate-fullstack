import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserApiService } from '../user/user-api.service';
import { TodoApiService } from '../todo/todo-api.service';
import { UserVm } from '../user/models/view-models/user-vm.model';
import { RegisterVm } from './models/view-models/register-vm.model';

@Resolver('User')
export class RegistrationResolvers {
  constructor(
    protected readonly userApiService: UserApiService,
    protected readonly todoApiService: TodoApiService
  ) {}

  @Mutation('register')
  async register(@Args() vm: RegisterVm): Promise<UserVm> {
    return this.userApiService.register(vm);
  }
}
