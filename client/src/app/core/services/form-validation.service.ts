import {Injectable} from '@angular/core';
import {FormControl} from '@angular/forms';

const FORM_VALIDATION_ERROR_MAP = {
  'email': 'Please enter a valid email',
  'minLength': 'Too short',
  'maxLength': 'Too long',
  'password': 'Does not meet the minimum password requirements',
  'required': 'This field is required',
};

@Injectable()
export class FormValidationService {

  constructor() {
  }

  public getControlError(control: FormControl) {
    if (control && !control.valid && control.errors) {
      const errors = Object.keys(control.errors).filter(err => !!control.errors[err]);
      if (errors.length) {
        return FORM_VALIDATION_ERROR_MAP[errors[0]];
      }
    }
    return null;
  }

}
