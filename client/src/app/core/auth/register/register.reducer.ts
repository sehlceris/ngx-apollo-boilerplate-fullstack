import { Action } from '@ngrx/store';
import { RegisterVm } from '../../../../../../server/src/user/models/view-models/register-vm.model';

export enum RegisterActionTypes {
  REGISTER_REQUEST = '[Register] REGISTER_REQUEST',
  REGISTER_SUCCESS = '[Register] REGISTER_SUCCESS',
  REGISTER_FAILURE = '[Register] REGISTER_FAILURE',
}

export class ActionRegisterRequest implements Action {
  constructor(readonly data: RegisterVm) {}
  readonly type = RegisterActionTypes.REGISTER_REQUEST;
}

export class ActionRegisterSuccess implements Action {
  constructor() {}
  readonly type = RegisterActionTypes.REGISTER_SUCCESS;
}

export class ActionRegisterFailure implements Action {
  constructor(readonly registerError: string) {}
  readonly type = RegisterActionTypes.REGISTER_FAILURE;
}

export type RegisterActions =
  | ActionRegisterRequest
  | ActionRegisterSuccess
  | ActionRegisterFailure;

export interface RegisterState {
  registering: boolean;
  registerError?: string;
}

export const initialState: RegisterState = {
  registering: false,
  registerError: null,
};

export const selectorRegister = (state): RegisterState => state.auth.register;

export function registerReducer(
  state: RegisterState = initialState,
  action: RegisterActions
): RegisterState {
  switch (action.type) {
    case RegisterActionTypes.REGISTER_REQUEST:
      return {
        ...state,
        registering: true,
        registerError: null,
      };
    case RegisterActionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        registering: false,
        registerError: null,
      };
    case RegisterActionTypes.REGISTER_FAILURE:
      return {
        ...state,
        registering: false,
        registerError: action.registerError,
      };
    default:
      return state;
  }
}
