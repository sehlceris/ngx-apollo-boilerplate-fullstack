import { Action } from '@ngrx/store';

export enum LoginActionTypes {
  LOGIN_WITH_USERNAME_REQUEST = '[Login] LOGIN_WITH_USERNAME_REQUEST',
  LOGIN_SUCCESS = '[Login] LOGIN_SUCCESS',
  LOGIN_FAILURE = '[Login] LOGIN_FAILURE',
  LOGOUT_REQUEST = '[Login] LOGOUT_REQUEST',
  LOGOUT_SUCCESS = '[Login] LOGOUT_SUCCESS',
}

export class ActionLoginWithUsernameRequest implements Action {
  constructor(readonly username: string, readonly password: string) {}
  readonly type = LoginActionTypes.LOGIN_WITH_USERNAME_REQUEST;
}

export class ActionLoginSuccess implements Action {
  constructor() {}
  readonly type = LoginActionTypes.LOGIN_SUCCESS;
}

export class ActionLoginFailure implements Action {
  constructor(readonly loginError: string) {}
  readonly type = LoginActionTypes.LOGIN_FAILURE;
}

export class ActionLogoutRequest implements Action {
  readonly type = LoginActionTypes.LOGOUT_REQUEST;
}

export class ActionLogoutSuccess implements Action {
  readonly type = LoginActionTypes.LOGOUT_SUCCESS;
}

export type LoginActions =
  | ActionLoginWithUsernameRequest
  | ActionLoginSuccess
  | ActionLoginFailure
  | ActionLogoutRequest
  | ActionLogoutSuccess;

export interface LoginState {
  loggingIn: boolean;
  loginError?: string;
}

export const initialState: LoginState = {
  loggingIn: false,
  loginError: null,
};

export const selectorLogin = (state): LoginState => state.auth.login;

export function loginReducer(
  state: LoginState = initialState,
  action: LoginActions
): LoginState {
  switch (action.type) {
    case LoginActionTypes.LOGIN_WITH_USERNAME_REQUEST:
      return {
        ...state,
        loggingIn: true,
        loginError: null,
      };
    case LoginActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        loginError: null,
      };
    case LoginActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        loggingIn: false,
        loginError: action.loginError,
      };
    case LoginActionTypes.LOGOUT_SUCCESS:
      return {
        ...state,
      };

    default:
      return state;
  }
}
