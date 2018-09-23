import { Action } from '@ngrx/store';

export const FORGOT_PASSWORD_KEY = 'FORGOT_PASSWORD';

export enum ForgotPasswordActionTypes {
  RESET_PASSWORD_BY_EMAIL = '[ForgotPassword] RESET_PASSWORD_BY_EMAIL',
  RESET_PASSWORD_BY_TEXT_MESSAGE = '[ForgotPassword] RESET_PASSWORD_BY_TEXT_MESSAGE',
  RESET_PASSWORD_WITH_TOKEN = '[ForgotPassword] RESET_PASSWORD_WITH_TOKEN',
  RESET_PASSWORD_SUCCESS = '[ForgotPassword] RESET_PASSWORD_SUCCESS',
  RESET_PASSWORD_FAILURE = '[ForgotPassword] RESET_PASSWORD_FAILURE',
  RESET_PASSWORD_REQUEST_SUCCESS = '[ForgotPassword] RESET_PASSWORD_REQUEST_SUCCESS',
  RESET_PASSWORD_REQUEST_FAILURE = '[ForgotPassword] RESET_PASSWORD_REQUEST_FAILURE',
}

export class ActionResetPasswordByEmail implements Action {
  constructor(readonly email: string) {}
  readonly type = ForgotPasswordActionTypes.RESET_PASSWORD_BY_EMAIL;
}

export class ActionResetPasswordByTextMessage implements Action {
  constructor(readonly phoneNumber: string) {}
  readonly type = ForgotPasswordActionTypes.RESET_PASSWORD_BY_TEXT_MESSAGE;
}

export class ActionResetPasswordWithToken implements Action {
  constructor(token: string) {}
  readonly type = ForgotPasswordActionTypes.RESET_PASSWORD_WITH_TOKEN;
}

export class ActionResetPasswordSuccess implements Action {
  constructor() {}
  readonly type = ForgotPasswordActionTypes.RESET_PASSWORD_SUCCESS;
}

export class ActionResetPasswordFailure implements Action {
  constructor(readonly error: string) {}
  readonly type = ForgotPasswordActionTypes.RESET_PASSWORD_FAILURE;
}

export class ActionResetPasswordRequestSuccess implements Action {
  constructor() {}
  readonly type = ForgotPasswordActionTypes.RESET_PASSWORD_REQUEST_SUCCESS;
}

export class ActionResetPasswordRequestFailure implements Action {
  constructor(readonly error: string) {}
  readonly type = ForgotPasswordActionTypes.RESET_PASSWORD_REQUEST_FAILURE;
}

export type ForgotPasswordActions =
  | ActionResetPasswordByEmail
  | ActionResetPasswordByTextMessage
  | ActionResetPasswordWithToken
  | ActionResetPasswordSuccess
  | ActionResetPasswordFailure
  | ActionResetPasswordRequestSuccess
  | ActionResetPasswordRequestFailure;

export interface ForgotPasswordState {
  submittingRequest: boolean;
  submittingReset: boolean;
  resetPasswordRequestError?: string;
  resetPasswordError?: string;
}

export const initialState: ForgotPasswordState = {
  submittingRequest: false,
  submittingReset: false,
  resetPasswordRequestError: null,
  resetPasswordError: null,
};

export const selectorForgotPassword = (state): ForgotPasswordState =>
  state.auth.forgotPassword;

export function forgotPasswordReducer(
  state: ForgotPasswordState = initialState,
  action: ForgotPasswordActions
): ForgotPasswordState {
  switch (action.type) {
    case ForgotPasswordActionTypes.RESET_PASSWORD_BY_EMAIL:
      return {
        ...state,
        submittingRequest: true,
        resetPasswordRequestError: null,
        resetPasswordError: null,
      };
    case ForgotPasswordActionTypes.RESET_PASSWORD_BY_TEXT_MESSAGE:
      return {
        ...state,
        submittingRequest: true,
        resetPasswordRequestError: null,
        resetPasswordError: null,
      };
    case ForgotPasswordActionTypes.RESET_PASSWORD_WITH_TOKEN:
      return state;
    case ForgotPasswordActionTypes.RESET_PASSWORD_REQUEST_FAILURE:
      return {
        ...state,
        submittingRequest: false,
        resetPasswordError: action.error,
      };
    case ForgotPasswordActionTypes.RESET_PASSWORD_FAILURE:
      return {
        ...state,
        submittingReset: false,
        resetPasswordError: action.error,
      };
    default:
      return state;
  }
}
