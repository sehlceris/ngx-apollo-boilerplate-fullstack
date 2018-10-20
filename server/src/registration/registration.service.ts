import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcryptjs';
import { ModelType } from 'typegoose';
import { BaseService } from '../shared/base.service';
import { MapperService } from '../shared/mapper/mapper.service';
import { RegisterVm } from './models/view-models/register-vm.model';
import { Registration, RegistrationModel } from './models/registration.model';

@Injectable()
export class RegistrationService extends BaseService<Registration> {
  constructor(
    @InjectModel(Registration.modelName)
    private readonly _registrationModel: ModelType<Registration>,
    private readonly _mapperService: MapperService
  ) {
    super();
    this._model = _registrationModel;
    this._mapper = _mapperService.mapper;
  }
}
