import {Action} from '@ngrx/store';

export enum VerifyEmailActionTypes {
  VERIFY_EMAIL = '[VerifyEmail] VERIFY_EMAIL',
  VERIFY_EMAIL_SUCCESS = '[VerifyEmail] VERIFY_EMAIL_SUCCESS',
  VERIFY_EMAIL_FAILURE = '[VerifyEmail] VERIFY_EMAIL_FAILURE',
}

export class ActionVerifyEmail implements Action {
  constructor(readonly payload: string) {}
  readonly type = VerifyEmailActionTypes.VERIFY_EMAIL;
}

export class ActionVerifyEmailSuccess implements Action {
  constructor() {}
  readonly type = VerifyEmailActionTypes.VERIFY_EMAIL_SUCCESS;
}

export class ActionVerifyEmailFailure implements Action {
  constructor(readonly payload: string) {}
  readonly type = VerifyEmailActionTypes.VERIFY_EMAIL_FAILURE;
}

export type ForgotPasswordActions = ActionVerifyEmail | ActionVerifyEmailSuccess | ActionVerifyEmailFailure;

export interface VerifyEmailState {
  verifyState: VerifyState;
  verifyToken: string;
  verifyError?: string;
}

export enum VerifyState {
  PRE_VERIFICATION = 'PRE_VERIFICATION',
  VERIFYING = 'VERIFYING',
  VERIFY_FAILURE = 'VERIFY_FAILURE',
  VERIFY_SUCCESS = 'VERIFY_SUCCESS',
}

export const initialState: VerifyEmailState = {
  verifyState: VerifyState.PRE_VERIFICATION,
  verifyToken: null,
  verifyError: null,
};

export const selectorVerifyEmail = (state): VerifyEmailState => state.auth.forgotPassword;

export function verifyEmailReducer(
  state: VerifyEmailState = initialState,
  action: ForgotPasswordActions,
): VerifyEmailState {
  switch (action.type) {
    case VerifyEmailActionTypes.VERIFY_EMAIL:
      return {
        ...state,
        verifyState: VerifyState.VERIFYING,
        verifyToken: action.payload,
        verifyError: null,
      };
    case VerifyEmailActionTypes.VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        verifyState: VerifyState.VERIFYING,
        verifyToken: null,
        verifyError: null,
      };
    case VerifyEmailActionTypes.VERIFY_EMAIL_FAILURE:
      return {
        ...state,
        verifyState: VerifyState.VERIFYING,
        verifyToken: null,
        verifyError: action.payload,
      };
    default:
      return state;
  }
}
