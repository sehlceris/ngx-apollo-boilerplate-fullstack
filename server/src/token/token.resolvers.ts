import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserApiService } from '../user/user-api.service';
import { TodoApiService } from '../todo/todo-api.service';
import { UserVm } from '../user/models/view-models/user-vm.model';

@Resolver('User')
export class TokenResolvers {
  constructor(
    protected readonly userApiService: UserApiService,
    protected readonly todoApiService: TodoApiService
  ) {}

  @Mutation('verifyEmail')
  async verifyEmail(@Args() vm: any): Promise<UserVm> {
    return null
  }
}
