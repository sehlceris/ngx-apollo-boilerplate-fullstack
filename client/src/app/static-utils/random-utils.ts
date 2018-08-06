import {Utils} from './utils';

export class RandomUtils {


  /**
   * Returns a random number between min (inclusive) and max (exclusive)
   * @param min
   * @param max
   * @param decimalPlacesAllowed
   * @returns {number}
   */
  static randomNumber(min = 0, max = 1000000, decimalPlacesAllowed?): number {
    let rand = Math.random() * (max - min) + min;
    if (typeof decimalPlacesAllowed === 'number' && decimalPlacesAllowed > 0 && isFinite(decimalPlacesAllowed)) {
      rand = Utils.truncateDecimals(rand, decimalPlacesAllowed);
    }
    return rand;
  }

  /**
   * Returns a random integer between min (inclusive) and max (inclusive)
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  static randomInt(min = 0, max = 1000000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Returns a random boolean
   * @param {number} chance - Defaults to 0.5, represents the probability of receiving back a true result
   * @returns {boolean}
   */
  static randomBoolean(chance = 0.5): boolean {
    if (chance > 1 || chance < 0) {
      throw new Error(`chance must be between 0 and 1`);
    }
    return this.randomNumber(0, 1) < chance;
  }

  /**
   * Returns a random string of letters and numbers 10-11 characters in length (not cryptographically secure)
   * @returns {string}
   */
  static randomString(): string {
    return Math.random().toString(36).substring(2);
  }

  /**
   * Returns a random UUID (not cryptographically secure)
   * @returns {string}
   */
  static randomUuid(): string {
    const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return template.replace(/[xy]/g, function (char) {
      const r = Math.random() * 16 | 0;
      const v = (char === 'x') ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


}