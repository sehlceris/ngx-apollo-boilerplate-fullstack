/**
 * Various utilities used throughout the application
 */

export class Utils {
  /**
   * Pads a number
   * @param original
   * @param width
   * @param padString
   * @returns {string}
   */
  static padNumber(original: number, width: number, padString?: string) {
    if (typeof padString !== 'string') {
      padString = '0';
    }
    const originalStr = String(original);
    return this.padString(originalStr, width, padString);
  }

  /**
   * Pads a string
   * @param original
   * @param width
   * @param padString
   * @returns {string}
   */
  static padString(original: string, width: number, padString?: string) {
    if (typeof padString !== 'string') {
      padString = '0';
    }
    return original.length >= width ? original : new Array(width - original.length + 1).join(padString) + original;
  }

  /**
   * Performs integer division and gives an object with the quotient and remainder
   * @param numerator
   * @param denominator
   * @returns {{quotient: number, remainder: number}}
   */
  static integerDivision(numerator: number, denominator: number) {
    const quo = Math.floor(numerator / denominator);
    const rem = numerator % denominator;
    return {
      quotient: quo,
      remainder: rem,
    };
  }

  static asyncDelay(ms: number = 1000): Promise<void> {
    if (!ms || typeof ms !== 'number' || !Number.isFinite(ms)) {
      throw new Error(`invalid delay time ${ms}`);
    }
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  /**
   * Given a list of Promises that may or may not reject, returns another Promise for all of the successfully resolved promise results in the list. Useful alternative to Promise.all when you care only about the resolved promises.
   * @param promises
   * @returns {Promise<Array<TResult>>}
   */
  static allResolvedPromises<T>(promises: Array<Promise<T>>): Promise<Array<T | Error>> {
    const settledPromise = Promise.all(
      promises.map((p) => {
        return p.catch((e) => {
          // we use 'instanceof Error' as a marker to filter out rejected promises - and therefore must wrap all Promise rejections in the Error object
          if (e instanceof Error) {
            return e;
          } else {
            return new Error(e);
          }
        });
      }),
    );

    const successfulResultsPromise = settledPromise.then((results) => {
      return results.filter((result) => {
        return !(result instanceof Error);
      });
    });

    return successfulResultsPromise;
  }

  /**
   * Given a list of Promises that may or may not reject, returns another Promise for all of the rejected promise results in the list. Useful alternative to Promise.all when you care only about the rejected promises. WARNING: In its current implementation, this function will return a successfully resolved Promise with an Array of Errors.
   * @param promises
   * @returns {Promise<Array<TResult>>}
   */
  static allRejectedPromises<T>(promises: Array<Promise<T>>): Promise<Array<Error>> {
    const settledPromise = Promise.all(
      promises.map((p) => {
        return p.catch((e) => {
          // we use 'instanceof Error' as a marker to filter out rejected promises - and therefore must wrap all Promise rejections in the Error object=
          if (e instanceof Error) {
            return e;
          } else {
            return new Error(e);
          }
        });
      }),
    );

    const rejectedResultsPromise = settledPromise.then((results) => {
      const erroredResults: Array<Error> = [];
      results.forEach((result: Error) => {
        if (result instanceof Error) {
          erroredResults.push(result);
        }
      });
      return erroredResults;
    });

    return rejectedResultsPromise;
  }

  /**
   * Given a Promise and a timeout value, returns a racing promise that will reject if the timeout value is reached
   * @param promise
   * @param timeout
   * @returns {Promise<any>}
   */
  static setPromiseTimeout(promise: Promise<any>, timeout: number) {
    if (typeof timeout !== 'number') {
      throw new Error('no promise timeout value specified');
    }
    return Promise.race([
      promise,
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject('promise timed out');
        }, timeout);
      }),
    ]);
  }

  /**
   * Creates a deep copy of an object
   * @param original
   * @returns {any}
   */
  static deepCopy(original): any {
    return JSON.parse(JSON.stringify(original));
  }

  /**
   * Parses an input into a boolean. If given a number, returns true if the number is above 0. If given a string, returns true if 'true', 'yes', or '1'. For other inputs, returns the given default outcome. If no default outcome, throws an error.
   * @param input
   * @param defaultOutcome
   * @returns {boolean}
   */
  static parseBoolean(input: any, defaultOutcome?: boolean): boolean {
    if (typeof input === 'boolean') {
      return input;
    } else if (typeof input === 'number') {
      if (input > 0) {
        return true;
      } else {
        return false;
      }
    } else if (typeof input === 'string') {
      switch (input.toLowerCase().trim()) {
        case 'true':
        case 'yes':
        case '1':
          return true;
        case 'false':
        case 'no':
        case '0':
          return false;
      }
    }
    if (typeof defaultOutcome === 'boolean') {
      return defaultOutcome;
    } else {
      throw new TypeError('failed to parse boolean from ' + input);
    }
  }

  /**
   * Returns the given number, truncated to the given precision
   * @param {number} n
   * @param {number} precision
   * @returns {number}
   */
  static numberToPrecision(n: number, precision: number): number {
    return Number.parseFloat(n.toPrecision(precision));
  }

  /**
   * Returns the given number with decimals, truncated to the given precision
   * @param {number} n
   * @param {number} precision
   * @returns {number}
   */
  static truncateDecimals(n: number, decimals: number): number {
    return Number.parseFloat(n.toFixed(decimals));
  }

  static numberWithCommas(x: number): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
