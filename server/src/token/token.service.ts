import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcryptjs';
import { ModelType } from 'typegoose';
import { BaseService } from '../shared/base.service';
import { MapperService } from '../shared/mapper/mapper.service';
import { Token, TokenModel } from './models/token.model';

@Injectable()
export class TokenService extends BaseService<Token> {
  constructor(
    @InjectModel(Token.modelName) private readonly _registrationModel: ModelType<Token>,
    private readonly _mapperService: MapperService,
  ) {
    super();
    this._model = _registrationModel;
    this._mapper = _mapperService.mapper;
  }
}
