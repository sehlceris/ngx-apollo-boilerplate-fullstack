import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare, genSalt, hash } from 'bcryptjs';
import { ModelType } from 'typegoose';
import { AuthService } from '../shared/auth/auth.service';
import {
  JwtAuthPayload,
  JwtPayload,
  JwtPayloadType,
  JwtSingleUseUserPayload,
  JwtUserPayload,
} from '../shared/auth/jwt-payload.model';
import { BaseService } from '../shared/base.service';
import { MapperService } from '../shared/mapper/mapper.service';
import { User, UserModel } from './models/user.model';
import { LoginResponseVm } from './models/view-models/login-response-vm.model';
import {
  LoginWithEmailVm,
  LoginWithIdVm,
  LoginWithUsernameVm,
} from './models/view-models/login-vm.model';
import { RegisterVm } from './models/view-models/register-vm.model';
import { UserVm } from './models/view-models/user-vm.model';
import { UserRole } from './models/user-role.enum';
import { randomUuid } from '../shared/utilities/random-utils';
import { MemoryCacheService } from '../shared/utilities/memory-cache.service';
import { Configuration } from '../shared/configuration/configuration.enum';
import { ConfigurationService } from '../shared/configuration/configuration.service';
import { Observable, Subject } from 'rxjs';
import { BoundLogger, LogService } from '../shared/utilities/log.service';

@Injectable()
export class UserService extends BaseService<User> {
  private newUserRegisteredSubject: Subject<UserVm> = new Subject<UserVm>();
  public newUserRegistered$: Observable<
    UserVm
  > = this.newUserRegisteredSubject.asObservable();

  private userVerifiedEmailSubject: Subject<UserVm> = new Subject<UserVm>();
  public userVerifiedEmail$: Observable<
    UserVm
  > = this.userVerifiedEmailSubject.asObservable();

  private userForgotPasswordSubject: Subject<UserVm> = new Subject<UserVm>();
  public userForgotPassword$: Observable<
    UserVm
  > = this.userForgotPasswordSubject.asObservable();

  private userRequestedPasswordResetSubject: Subject<UserVm> = new Subject<
    UserVm
  >();
  public userRequestedPasswordReset$: Observable<
    UserVm
  > = this.userRequestedPasswordResetSubject.asObservable();

  private userExecutePasswordResetSubject: Subject<UserVm> = new Subject<
    UserVm
  >();
  public userExecutePasswordReset$: Observable<
    UserVm
  > = this.userExecutePasswordResetSubject.asObservable();

  private userChangedPasswordSubject: Subject<UserVm> = new Subject<UserVm>();
  public userChangedPassword$: Observable<
    UserVm
  > = this.userChangedPasswordSubject.asObservable();

  private log: BoundLogger = this.logService.bindToNamespace(UserService.name);

  constructor(
    private configurationService: ConfigurationService,
    @InjectModel(User.modelName) private readonly _userModel: ModelType<User>,
    private readonly _mapperService: MapperService,
    @Inject(forwardRef(() => AuthService)) readonly _authService: AuthService,
    private readonly memoryCacheService: MemoryCacheService,
    private logService: LogService
  ) {
    super();
    this._model = _userModel;
    this._mapper = _mapperService.mapper;
  }

  async register(vm: RegisterVm): Promise<User> {
    const { username, email, password } = vm;

    const newUser = new UserModel();
    newUser.username = username.trim().toLowerCase();
    newUser.email = email.trim().toLowerCase();
    newUser.role = UserRole.UnconfirmedUser;

    const salt = await genSalt(10);
    newUser.password = await hash(password, salt);

    try {
      const result = await this.create(newUser);
      const resultJSON = result.toJSON() as User;
      const resultMapped = await this.map<UserVm>(resultJSON);
      this.newUserRegisteredSubject.next(resultMapped);
      return resultJSON;
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async loginWithUsername(vm: LoginWithUsernameVm): Promise<LoginResponseVm> {
    const { username, password } = vm;
    const user = await this.findOne({ username });
    return this.performCommonLoginSequence(user, password);
  }

  async loginWithEmail(vm: LoginWithEmailVm): Promise<LoginResponseVm> {
    const { email, password } = vm;
    const user = await this.findOne({ email });
    return this.performCommonLoginSequence(user, password);
  }

  async loginWithId(vm: LoginWithIdVm): Promise<LoginResponseVm> {
    const { id, password } = vm;
    const user = await this.findById(id);
    return this.performCommonLoginSequence(user, password);
  }

  async requestPasswordReset(email: string) {
    const user = await this.findOne({ email });
    if (user) {
      const userVm: UserVm = await this.map<UserVm>(user.toJSON());
      this.userRequestedPasswordResetSubject.next(userVm);
    }
  }

  private async createJwtAuthPayload(user: UserVm): Promise<string> {
    const payload: JwtAuthPayload = {
      type: JwtPayloadType.Auth,
      userId: user.id,
      role: user.role,
    };
    const token = await this._authService.signPayload(payload, {
      expiresIn: this.configurationService.get(
        Configuration.JWT_AUTH_TOKEN_EXPIRATION
      ),
    });
    return token;
  }

  async createJwtVerifyEmailPayload(user: UserVm): Promise<string> {
    const type = JwtPayloadType.VerifyEmail;
    const payload: JwtSingleUseUserPayload = this.createJwtSingleUseUserPayload(
      user,
      type
    );
    const token = await this._authService.signPayload(payload, {
      expiresIn: this.configurationService.get(
        Configuration.JWT_EMAIL_VERIFICATION_TOKEN_EXPIRATION
      ),
    });
    return token;
  }

  async createJwtResetPasswordPayload(user: UserVm): Promise<string> {
    const type = JwtPayloadType.ResetPassword;
    const payload: JwtSingleUseUserPayload = this.createJwtSingleUseUserPayload(
      user,
      type
    );
    const token = await this._authService.signPayload(payload, {
      expiresIn: this.configurationService.get(
        Configuration.JWT_EMAIL_VERIFICATION_TOKEN_EXPIRATION
      ),
    });
    return token;
  }

  private createJwtSingleUseUserPayload(
    user: UserVm,
    type: JwtPayloadType
  ): JwtSingleUseUserPayload {
    return {
      type: type,
      userId: user.id,
      jti: this.createAndStoreJti(type),
    };
  }

  private createAndStoreJti(type: JwtPayloadType): string {
    const uuid = randomUuid();
    this.memoryCacheService.addJti(type, uuid);
    return uuid;
  }

  private async performCommonLoginSequence(
    user,
    passwordToTest: string
  ): Promise<LoginResponseVm> {
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.NOT_FOUND);
    }

    const isMatch = await compare(passwordToTest, user.password);

    if (!isMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const token = await this.createJwtAuthPayload(user);

    const userVm: UserVm = await this.map<UserVm>(user.toJSON());

    return {
      token,
      user: userVm,
    };
  }

  async updatePasswordById(id: string, newPassword: string): Promise<UserVm> {
    const user = await this.findById(id);
    if (!user) {
      throw new HttpException(`No user with id ${id}`, HttpStatus.NOT_FOUND);
    }

    const salt = await genSalt(10);
    user.password = await hash(newPassword, salt);

    try {
      const updatedUser = await this.update(id, user);
      return updatedUser.toJSON() as User;
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
