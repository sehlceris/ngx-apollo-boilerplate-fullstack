import { Injectable } from '@angular/core';
import { BoundLogger, LogService } from '@app/core/services';

const APP_PREFIX = 'ANMS-';
const LOCAL_STORAGE_STORE_VERSION_KEY = `${APP_PREFIX}storeVersion`;

@Injectable()
export class LocalStorageService {
  private log: BoundLogger = this.logService.bindToNamespace(LocalStorageService.name);

  constructor(private logService: LogService) {}

  static loadInitialState() {
    console.log('loadInitialState localStorage', localStorage);
    return Object.keys(localStorage).reduce((state: any, storageKey) => {
      if (storageKey.startsWith(APP_PREFIX)) {
        state = state || {};
        const stateKey = storageKey
          .replace(APP_PREFIX, '')
          .toLowerCase()
          .split('.');
        let currentStateRef = state;
        stateKey.forEach((key, index) => {
          if (index === stateKey.length - 1) {
            currentStateRef[key] = JSON.parse(localStorage.getItem(storageKey));
            return;
          }
          currentStateRef[key] = currentStateRef[key] || {};
          currentStateRef = currentStateRef[key];
        });
      }
      return state;
    }, undefined);
  }

  static clearStoredState() {
    Object.keys(localStorage).map((storageKey) => {
      if (storageKey.startsWith(APP_PREFIX)) {
        localStorage.removeItem(storageKey);
      }
    });
    localStorage.removeItem(LOCAL_STORAGE_STORE_VERSION_KEY);
  }

  static getLocalStorageStoreVersion(): number {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_STORE_VERSION_KEY));
  }

  static setLocalStorageStoreVersion(number): void {
    return localStorage.setItem(LOCAL_STORAGE_STORE_VERSION_KEY, JSON.stringify(number));
  }

  setItem(key: string, value: any) {
    this.log.debug(`setItem: key:${JSON.stringify(value, null, 2)}`);
    localStorage.setItem(`${APP_PREFIX}${key}`, JSON.stringify(value));
  }

  getItem(key: string) {
    return JSON.parse(localStorage.getItem(`${APP_PREFIX}${key}`));
  }
}
