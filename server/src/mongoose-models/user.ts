import * as bcrypt from 'bcrypt';
import {instanceMethod, pre, prop, Typegoose} from 'typegoose';

@pre<User>('save', function (next) {
  const user = <User> this;
  if (!this.isModified('hashedPassword')) {
    return next();
  }
  bcrypt.hash(user.hashedPassword, 10)
    .then((hashedPassword) => {
      user.hashedPassword = hashedPassword;
      next();
    })
    .catch(next);
})
export class User extends Typegoose {

  @prop({required: true})
  email: string;

  @prop({required: true})
  username: boolean;

  @prop({required: true})
  hashedPassword?: string;

  @instanceMethod
  comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.hashedPassword);
  }
}

export const UserModel = new User().getModelForClass(User);
