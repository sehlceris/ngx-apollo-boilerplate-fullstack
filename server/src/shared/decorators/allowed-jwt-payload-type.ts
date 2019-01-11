import {ReflectMetadata} from '@nestjs/common';
import {UserRole} from '../../user/models/user-role.enum';
import {JwtPayloadType} from '../auth/jwt-payload.model';

export const AllowedJwtPayloadType = (payloadType: JwtPayloadType) => ReflectMetadata('jwtPayloadType', payloadType);
