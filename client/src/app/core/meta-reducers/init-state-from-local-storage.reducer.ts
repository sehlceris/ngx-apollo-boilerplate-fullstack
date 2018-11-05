import { ActionReducer, INIT, UPDATE } from '@ngrx/store';

import { LocalStorageService } from '../local-storage/local-storage.service';

const STORE_VERSION = 1;

export function initStateFromLocalStorage(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    const newState = reducer(state, action);
    if ([INIT.toString(), UPDATE.toString()].includes(action.type)) {
      const previousStoreVersion = LocalStorageService.getLocalStorageStoreVersion();
      if (previousStoreVersion === STORE_VERSION) {
        return { ...newState, ...LocalStorageService.loadInitialState() };
      } else {
        console.warn(
          `WARNING: Clearing stored state because the previous store's version ${previousStoreVersion} conflicts with current store version ${STORE_VERSION}`,
        );
        LocalStorageService.clearStoredState();
        LocalStorageService.setLocalStorageStoreVersion(STORE_VERSION);
      }
    }
    return newState;
  };
}
