import {Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {OperatorFunction} from 'rxjs/internal/types';
import {tap} from 'rxjs/operators';

export enum LogLevel {
  DEBUG = 4,
  INFO = 3,
  WARN = 2,
  ERROR = 1,
}

export const logLevelToString: Map<LogLevel, string> = new Map<LogLevel, string>();
logLevelToString.set(LogLevel.DEBUG, 'DEBUG');
logLevelToString.set(LogLevel.INFO, 'INFO');
logLevelToString.set(LogLevel.WARN, 'WARN');
logLevelToString.set(LogLevel.ERROR, 'ERROR');

export type LogFunction = (message) => void;
export type LogFormatter = (namespace: string, message: string, level: LogLevel) => string;

@Injectable()
export class LogService {
  private logLevel: LogLevel = LogLevel.INFO;
  private logFn: LogFunction = LogService.defaultLogFunction;
  private logFormatter: LogFormatter = LogService.defaultLogFormatter;

  constructor() {
    this.setLogFunction(LogService.defaultLogFunction);
  }

  public log(namespace: string, message: any, level: LogLevel = LogLevel.INFO) {
    message = this.objToMessage(message);
    message = this.logFormatter(namespace, message, level);
    this.logFn(message);
  }

  public debug(namespace: string, message: any) {
    this.log(namespace, message, LogLevel.DEBUG);
  }

  public info(namespace: string, message: any) {
    this.log(namespace, message, LogLevel.INFO);
  }

  public warn(namespace: string, message: any) {
    this.log(namespace, message, LogLevel.WARN);
  }

  public error(namespace: string, message: any) {
    this.log(namespace, message, LogLevel.ERROR);
  }

  public static defaultLogFunction(message: string): void {
    console.log(message);
  }

  public static defaultLogFormatter(namespace: string, message: string, level: LogLevel): string {
    return `[${LogService.logLevelToString(level)}] [${namespace}] ${message}`;
  }

  public static logLevelToString(level: LogLevel): string {
    return logLevelToString.get(level);
  }

  public setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  public setLogFunction(fn: LogFunction) {
    this.logFn = fn;
  }

  public objToMessage(obj: any): string {
    if (typeof obj === 'string') {
      return obj;
    } else {
      return JSON.stringify(obj, null, 2);
    }
  }

  public tapObservableForLogging<T>(
    namespace: string,
    name: string,
    nextLevel: LogLevel = LogLevel.DEBUG,
    errLevel: LogLevel = LogLevel.ERROR,
    completeLevel: LogLevel = LogLevel.DEBUG,
  ): OperatorFunction<T, T> {
    return (source$: Observable<T>): Observable<T> => {
      return source$.pipe(
        tap(
          (next: any) => {
            this.log(namespace, `${name} next: ${this.objToMessage(next)}`, nextLevel);
          },
          (err: any) => {
            this.log(namespace, `${name} err: ${this.objToMessage(err)}`, errLevel);
          },
          () => {
            this.log(namespace, `${name} complete`, completeLevel);
          },
        ),
      );
    };
  }

  public bindToNamespace(namespace: string): BoundLogger {
    return new BoundLogger(namespace, this);
  }
}

export class BoundLogger {
  constructor(private namespace: string, private logger: LogService) {}

  public debug(message: any) {
    this.log(message, LogLevel.DEBUG);
  }

  public info(message: any) {
    this.log(message, LogLevel.INFO);
  }

  public warn(message: any) {
    this.log(message, LogLevel.WARN);
  }

  public error(message: any) {
    this.log(message, LogLevel.ERROR);
  }

  private log(message: any, level: LogLevel) {
    this.logger.log(this.namespace, message, level);
  }

  public tapObservableForLogging(
    name: string = 'observable',
    nextLevel: LogLevel = LogLevel.INFO,
    errLevel: LogLevel = LogLevel.ERROR,
    completeLevel: LogLevel = LogLevel.INFO,
  ) {
    return this.logger.tapObservableForLogging(this.namespace, name, nextLevel, errLevel, completeLevel);
  }
}
