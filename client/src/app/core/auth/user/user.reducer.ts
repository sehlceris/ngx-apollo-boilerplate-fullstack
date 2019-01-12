import {Action} from '@ngrx/store';
import {UserVm} from '../../../../../../server/src/user/models/view-models/user-vm.model';

export const USER_LOCAL_STORAGE_KEY = 'auth.user'; // this must match the path to the state in the store

export enum UserActionTypes {
  AUTHENTICATE = '[User] AUTHENTICATE',
  UNAUTHENTICATE = '[User] UNAUTHENTICATE',
}

export class ActionUserAuthenticate implements Action {
  constructor(readonly token: string, readonly user: UserVm) {}
  readonly type = UserActionTypes.AUTHENTICATE;
}

export class ActionUserUnauthenticate implements Action {
  constructor() {}
  readonly type = UserActionTypes.UNAUTHENTICATE;
}

export type AuthActions = ActionUserAuthenticate | ActionUserUnauthenticate;

export interface UserState {
  token?: string;
  basicInfo?: UserVm;
}

export const initialState: UserState = {
  token: null,
  basicInfo: null,
};

export const selectorUser = (state): UserState => state.auth.user;

export function userReducer(state: UserState = initialState, action: AuthActions): UserState {
  switch (action.type) {
    case UserActionTypes.AUTHENTICATE:
      return {
        ...state,
        token: action.token,
        basicInfo: action.user,
      };
    case UserActionTypes.UNAUTHENTICATE:
      return {
        ...state,
        token: null,
        basicInfo: null,
      };
    default:
      return state;
  }
}
