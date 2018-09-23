import { loginReducer } from '@app/core/auth/login/login.reducer';
import { registerReducer } from '@app/core/auth/register/register.reducer';
import { userReducer } from '@app/core/auth/user/user.reducer';
import { combineReducers } from '@ngrx/store';
import { forgotPasswordReducer } from '@app/core/auth/forgot-password/forgot-password.reducer';

export const authReducer = combineReducers({
  user: userReducer,
  login: loginReducer,
  register: registerReducer,
  forgotPassword: forgotPasswordReducer,
});
