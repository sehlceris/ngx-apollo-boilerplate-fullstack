import { Action } from '@ngrx/store';
import { UserVm } from '../../../../../server/src/user/models/view-models/user-vm.model';

export const AUTH_KEY = 'AUTH';

export enum AuthActionTypes {
  LOGIN_REQUEST = '[Auth] LOGIN_REQUEST',
  LOGIN_SUCCESS = '[Auth] LOGIN_SUCCESS',
  LOGIN_FAILURE = '[Auth] LOGIN_FAILURE',
  LOGOUT_REQUEST = '[Auth] LOGOUT_REQUEST',
  LOGOUT_SUCCESS = '[Auth] LOGOUT_SUCCESS',
}

export class ActionAuthLoginRequest implements Action {
  constructor(readonly username: string, readonly password: string) {}
  readonly type = AuthActionTypes.LOGIN_REQUEST;
}

export class ActionAuthLoginSuccess implements Action {
  constructor(readonly token: string, readonly user: UserVm) {}
  readonly type = AuthActionTypes.LOGIN_SUCCESS;
}

export class ActionAuthLoginFailure implements Action {
  constructor(readonly loginError: string) {}
  readonly type = AuthActionTypes.LOGIN_FAILURE;
}

export class ActionAuthLogoutRequest implements Action {
  readonly type = AuthActionTypes.LOGOUT_REQUEST;
}

export class ActionAuthLogoutSuccess implements Action {
  readonly type = AuthActionTypes.LOGOUT_SUCCESS;
}

export type AuthActions =
  | ActionAuthLoginRequest
  | ActionAuthLoginSuccess
  | ActionAuthLoginFailure
  | ActionAuthLogoutRequest
  | ActionAuthLogoutSuccess;

export interface AuthState {
  loggingIn: boolean;
  loginError?: string;
  token?: string;
  user?: UserVm;
}

export const initialState: AuthState = {
  loggingIn: false,
  loginError: null,
  token: null,
  user: null,
};

export const selectorAuth = (state) => state.auth;

export function authReducer(
  state: AuthState = initialState,
  action: AuthActions
): AuthState {
  switch (action.type) {
    case AuthActionTypes.LOGIN_REQUEST:
      return {
        ...state,
        loggingIn: true,
        loginError: null,
      };
    case AuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        token: action.token,
        user: action.user,
      };
    case AuthActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        loggingIn: false,
        loginError: action.loginError,
      };
    case AuthActionTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        token: null,
        user: null,
      };

    default:
      return state;
  }
}
