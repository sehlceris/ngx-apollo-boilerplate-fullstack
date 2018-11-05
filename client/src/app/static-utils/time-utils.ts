import * as moment from 'moment';
import { Utils } from './utils';

export class TimeUtils {
  private static flatTimeOffsetRegex: RegExp = /\s*(\d+):(\d+):(\d+):?\.?(\d+)?\s*/;

  /**
   * Converts "HH:MM:SS:mmm" to milliseconds
   * @param hmsString
   * @returns {any}
   */
  static convertHMSToMS(hmsString) {
    if (typeof hmsString !== 'string') {
      return hmsString;
    }

    if (TimeUtils.flatTimeOffsetRegex.test(hmsString)) {
      const timeArray = TimeUtils.flatTimeOffsetRegex.exec(hmsString);
      let ms =
        parseInt(timeArray[3], 10) * 1000 +
        parseInt(timeArray[2], 10) * 1000 * 60 +
        parseInt(timeArray[1], 10) * 1000 * 60 * 60; // convert HH:MM:SS to millis
      if (timeArray[4]) {
        ms += parseInt(timeArray[4], 10);
      } // ms parameter is optional, HH:MM:SS is not
      return ms;
    } else {
      return null;
    }
  }

  /**
   * Converts milliseconds to "HH:MM:SS:mmm"
   * @param ms
   * @returns {any}
   */
  static convertMSToHMS(ms) {
    if (typeof ms !== 'number') {
      return ms;
    }

    let temp = null;

    temp = Utils.integerDivision(ms, 3600000);
    const hours = Utils.padNumber(temp.quotient, 2);
    ms = temp.remainder;

    temp = Utils.integerDivision(ms, 60000);
    const minutes = Utils.padNumber(temp.quotient, 2);
    ms = temp.remainder;

    temp = Utils.integerDivision(ms, 1000);
    const seconds = Utils.padNumber(temp.quotient, 2);

    let hmsString;

    if (temp.remainder) {
      ms = Utils.padNumber(temp.remainder, 3);
      hmsString = hours + ':' + minutes + ':' + seconds + '.' + ms;
    } else {
      hmsString = hours + ':' + minutes + ':' + seconds;
    }
    return hmsString;
  }

  /**
   * Gets the number of weeks since epoch
   * @param {boolean} floor - Optional and default true; if false, does not run Math.floor() on the weeks
   * @param {Date} date - Optional and default null; the date to act on
   * @returns {number}
   */
  static weeksSinceEpoch(floor: boolean = true, date?: Date): number {
    const momentToCompare = date ? moment(date) : moment();
    const weeksSinceEpoch = moment.duration(momentToCompare.diff(moment(0))).asWeeks();
    return floor ? Math.floor(weeksSinceEpoch) : weeksSinceEpoch;
  }
}
