import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Registration } from './models/registration.model';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { RegistrationApiService } from './registration-api.service';
import { RegistrationResolvers } from './registration.resolvers';
import { TodoModule } from '../todo/todo.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Registration.modelName, schema: Registration.model.schema },
    ]),
    TodoModule,
  ],
  providers: [RegistrationService, RegistrationApiService, RegistrationResolvers],
  controllers: [RegistrationController],
  exports: [RegistrationService, RegistrationApiService, RegistrationResolvers],
})
export class RegistrationModule {}
