import {ModelType, pre, prop, Typegoose} from 'typegoose';
import {schemaOptions} from '../../shared/base.model';
import {UserRole} from './user-role.enum';
import {randomBase64Sync} from '../../shared/utilities/random-utils';
import {SecurityConstants} from '../../shared/constants/security-constants';

@pre<User>('findOneAndUpdate', function(next) {
  this._update.updatedAt = new Date(Date.now());
  next();
})
export class User extends Typegoose {
  @prop({
    required: [true, 'Username is required'],
    unique: true,
    minlength: [4, 'Must be at least 4 characters'],
  })
  username: string;

  @prop({
    required: [true, 'Email is required'],
    unique: true,
  })
  email: string;

  @prop({
    required: [true, 'Password is required'],
    minlength: [6, 'Must be at least 6 characters'],
  })
  password: string;

  @prop({enum: UserRole, default: UserRole.User})
  role?: UserRole;

  @prop({default: Date.now()})
  createdAt?: Date;

  @prop({default: Date.now()})
  updatedAt?: Date;

  @prop({
    default: randomBase64Sync(SecurityConstants.SecurityIdentifierByteLength),
  })
  securityIdentifier?: string;

  id?: string;

  static get model(): ModelType<User> {
    return new User().getModelForClass(User, {schemaOptions});
  }

  static get modelName(): string {
    return this.model.modelName;
  }
}

export const UserModel = new User().getModelForClass(User, {schemaOptions});
