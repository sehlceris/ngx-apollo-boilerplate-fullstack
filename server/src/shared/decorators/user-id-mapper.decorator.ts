import {ReflectMetadata} from '@nestjs/common';
import {noop} from 'rxjs';

export const TARGET_USER_ID_METADATA_KEY = 'TARGET_USER_ID_METADATA_KEY';
export const TARGET_METADATA_KEY_INDEX = 'TARGET_METADATA_KEY_INDEX';

export const TargetUserId = function (target: any, propertyKey: string, index: number) {
  Reflect.defineMetadata(TARGET_METADATA_KEY_INDEX, index, target, propertyKey);
  console.log('targetUserId', target, propertyKey,
    Reflect.getMetadata(TARGET_METADATA_KEY_INDEX, target, propertyKey));
};

export const LogTargetUserId = function () {

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

    console.log('LogTargetUserId: propertyKey', propertyKey);
    console.log('LogTargetUserId: descriptor', descriptor);
    console.log('LogTargetUserId: target', target);

    const originalMethod = descriptor.value;

    const decoratedMethod = function (...args: any[]) {

      const index = Reflect.getMetadata(TARGET_METADATA_KEY_INDEX, target, propertyKey);
      console.log('LogTargetUserId: index', index);

      if (typeof index === 'number') {
        const indexVal = args[index];
        console.log('indexVal', indexVal);
        ReflectMetadata(TARGET_USER_ID_METADATA_KEY, indexVal);
      }
      return originalMethod.apply(this, args);
    };

    descriptor.value = decoratedMethod;

    // return edited descriptor as opposed to overwriting the descriptor
    return descriptor;
  };
};
