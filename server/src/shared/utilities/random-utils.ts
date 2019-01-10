import * as crypto from 'crypto';
import * as uuid from 'uuid/v5';

export const randomNumberInsecure = function(min: number = 0, max: number = 1): number {
  return Math.random() * (max-min) + min;
};

export const randomIntegerInsecure = function(min: number = 0, max: number = 1): number {
  return Math.floor(randomNumberInsecure(min, max));
};

export const randomHex = function(byteLength: number = 16): Promise<string> {
  return new Promise(function(resolve) {
    crypto.randomBytes(byteLength, function(err, buffer) {
      const random = buffer.toString('hex');
      resolve(random);
    });
  });
};

export const randomBase64 = function(byteLength: number = 16): Promise<string> {
  return new Promise(function(resolve) {
    crypto.randomBytes(byteLength, function(err, buffer) {
      const random = buffer.toString('base64');
      resolve(random);
    });
  });
};

export const randomBase64Sync = function(byteLength: number = 16): string {
  return crypto.randomBytes(byteLength).toString('base64');
};

export const randomUuid = function(namespace: string = 'http://example.com'): string {
  return uuid(namespace, uuid.URL);
};
