import * as crypto from 'crypto';
import * as uuid from 'uuid/v5';

export const randomHex = function (byteLength: number = 16): Promise<string> {
  return new Promise(function (resolve) {
    crypto.randomBytes(byteLength, function (err, buffer) {
      const random = buffer.toString('hex');
      resolve(random);
    });
  });
};

export const randomUuid = function(namespace: string = 'http://example.com'): string {
  return uuid(namespace, uuid.URL);
};
