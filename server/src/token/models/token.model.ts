import { ModelType, pre, prop, Typegoose } from 'typegoose';
import { schemaOptions } from '../../shared/base.model';

@pre<Token>('findOneAndUpdate', function(next) {
  this._update.updatedAt = new Date(Date.now());
  next();
})
export class Token extends Typegoose {
  @prop({
    required: [true, 'User ID is required'],
    unique: true,
  })
  userId: string;

  @prop({
    required: [true, 'Confirmation token is required'],
    unique: true,
  })
  confirmationToken: string;

  @prop({ default: Date.now() })
  createdAt?: Date;

  @prop({ default: Date.now() })
  updatedAt?: Date;

  id?: string;

  static get model(): ModelType<Token> {
    return new Token().getModelForClass(Token, { schemaOptions });
  }

  static get modelName(): string {
    return this.model.modelName;
  }
}

export const TokenModel = new Token().getModelForClass(Token, {
  schemaOptions,
});
