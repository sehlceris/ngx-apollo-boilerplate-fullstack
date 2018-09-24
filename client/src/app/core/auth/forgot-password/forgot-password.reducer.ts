import { Action } from '@ngrx/store';

export const FORGOT_PASSWORD_KEY = 'FORGOT_PASSWORD';

export enum ForgotPasswordActionTypes {
  GENERATE_RESET_TOKEN_BY_EMAIL = '[ForgotPassword] GENERATE_RESET_TOKEN_BY_EMAIL',
  GENERATE_RESET_TOKEN_BY_EMAIL_SUCCESS = '[ForgotPassword] GENERATE_RESET_TOKEN_BY_EMAIL_SUCCESS',
  GENERATE_RESET_TOKEN_BY_EMAIL_FAILURE = '[ForgotPassword] GENERATE_RESET_TOKEN_BY_EMAIL_FAILURE',
  GENERATE_RESET_TOKEN_BY_TEXT_MESSAGE = '[ForgotPassword] GENERATE_RESET_TOKEN_BY_TEXT_MESSAGE',
  GENERATE_RESET_TOKEN_BY_TEXT_MESSAGE_SUCCESS = '[ForgotPassword] GENERATE_RESET_TOKEN_BY_TEXT_MESSAGE_SUCCESS',
  GENERATE_RESET_TOKEN_BY_TEXT_MESSAGE_FAILURE = '[ForgotPassword] GENERATE_RESET_TOKEN_BY_TEXT_MESSAGE_FAILURE',
  RESET_PASSWORD_WITH_EMAIL_TOKEN = '[ForgotPassword] RESET_PASSWORD_WITH_EMAIL_TOKEN',
  RESET_PASSWORD_WITH_TEXT_MESSAGE_TOKEN = '[ForgotPassword] RESET_PASSWORD_WITH_TEXT_MESSAGE_TOKEN',
  RESET_PASSWORD_SUCCESS = '[ForgotPassword] RESET_PASSWORD_SUCCESS',
  RESET_PASSWORD_FAILURE = '[ForgotPassword] RESET_PASSWORD_FAILURE',
}

export class ActionGenerateResetTokenByEmail implements Action {
  constructor(readonly email: string) {}
  readonly type = ForgotPasswordActionTypes.GENERATE_RESET_TOKEN_BY_EMAIL;
}

export class ActionGenerateResetTokenByEmailSuccess implements Action {
  constructor() {}
  readonly type =
    ForgotPasswordActionTypes.GENERATE_RESET_TOKEN_BY_EMAIL_SUCCESS;
}

export class ActionGenerateResetTokenByEmailFailure implements Action {
  constructor(readonly error: string) {}
  readonly type =
    ForgotPasswordActionTypes.GENERATE_RESET_TOKEN_BY_EMAIL_FAILURE;
}

export class ActionGenerateResetTokenByTextMessage implements Action {
  constructor(readonly phoneNumber: string) {}
  readonly type =
    ForgotPasswordActionTypes.GENERATE_RESET_TOKEN_BY_TEXT_MESSAGE;
}

export class ActionGenerateResetTokenByTextMessageSuccess implements Action {
  constructor() {}
  readonly type =
    ForgotPasswordActionTypes.GENERATE_RESET_TOKEN_BY_TEXT_MESSAGE_SUCCESS;
}

export class ActionGenerateResetTokenByTextMessageFailure implements Action {
  constructor(readonly error: string) {}
  readonly type =
    ForgotPasswordActionTypes.GENERATE_RESET_TOKEN_BY_TEXT_MESSAGE_FAILURE;
}

export class ActionResetPasswordWithEmailToken implements Action {
  constructor(token: string, password: string) {}
  readonly type = ForgotPasswordActionTypes.RESET_PASSWORD_WITH_EMAIL_TOKEN;
}

export class ActionResetPasswordWithTextMessageToken implements Action {
  constructor(token: string, password: string) {}
  readonly type =
    ForgotPasswordActionTypes.RESET_PASSWORD_WITH_TEXT_MESSAGE_TOKEN;
}

export class ActionResetPasswordSuccess implements Action {
  constructor() {}
  readonly type = ForgotPasswordActionTypes.RESET_PASSWORD_SUCCESS;
}

export class ActionResetPasswordFailure implements Action {
  constructor(readonly error: string) {}
  readonly type = ForgotPasswordActionTypes.RESET_PASSWORD_FAILURE;
}

export type ForgotPasswordActions =
  | ActionGenerateResetTokenByEmail
  | ActionGenerateResetTokenByEmailSuccess
  | ActionGenerateResetTokenByEmailFailure
  | ActionGenerateResetTokenByTextMessage
  | ActionGenerateResetTokenByTextMessageSuccess
  | ActionGenerateResetTokenByTextMessageFailure
  | ActionResetPasswordWithEmailToken
  | ActionResetPasswordWithTextMessageToken
  | ActionResetPasswordSuccess
  | ActionResetPasswordFailure;

export interface ForgotPasswordState {
  generatingToken: boolean;
  generateResetTokenError?: string;
  submittingReset: boolean;
  resetPasswordError?: string;
}

export const initialState: ForgotPasswordState = {
  generatingToken: false,
  generateResetTokenError: null,
  submittingReset: false,
  resetPasswordError: null,
};

export const selectorForgotPassword = (state): ForgotPasswordState =>
  state.auth.forgotPassword;

export function forgotPasswordReducer(
  state: ForgotPasswordState = initialState,
  action: ForgotPasswordActions
): ForgotPasswordState {
  switch (action.type) {
    case ForgotPasswordActionTypes.GENERATE_RESET_TOKEN_BY_EMAIL:
      return {
        ...state,
        generatingToken: true,
        generateResetTokenError: null,
        resetPasswordError: null,
      };
    case ForgotPasswordActionTypes.GENERATE_RESET_TOKEN_BY_TEXT_MESSAGE:
      return {
        ...state,
        generatingToken: true,
        generateResetTokenError: null,
        resetPasswordError: null,
      };
    case ForgotPasswordActionTypes.RESET_PASSWORD_WITH_EMAIL_TOKEN:
      return state;
    case ForgotPasswordActionTypes.GENERATE_RESET_TOKEN_BY_EMAIL_FAILURE:
      return {
        ...state,
        generatingToken: false,
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
