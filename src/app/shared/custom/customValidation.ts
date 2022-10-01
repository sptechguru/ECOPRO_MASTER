import { FormGroup, ValidationErrors, ValidatorFn, AbstractControl, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export interface AllValidationErrors {
  control_name: string;
  error_name: string;
  error_value: any;
}

export interface FormGroupControls {
  [key: string]: AbstractControl;
}

export function password(registerForm: FormGroup) {
  const { value: password } = registerForm.get('password');
  const { value: confirm_password } = registerForm.get('confirm_password');
  return password === confirm_password ? null : { passwordNotMatch: true };
}

export function patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.value) {
      // if control is empty return no error
      return null;
    }

    // test the value of the control against the regexp supplied
    const valid = regex.test(control.value);

    // if true, return no error (no error), else return error passed in the second parameter
    return valid ? null : error;
  };
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export const passwordValidator = Validators.compose([
  // 1. Password Field is Required
  Validators.required,
  // 2. check whether the entered password has a number
  patternValidator(/\d/, { hasNumber: true }),
  // 3. check whether the entered password has upper case letter
  patternValidator(/[A-Z]/, { hasCapitalCase: true }),
  // 4. check whether the entered password has a lower-case letter
  patternValidator(/[a-z]/, { hasSmallCase: true }),
  // 5. check whether the entered password has a special character
  patternValidator(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,100})/, { hasSpecialCharacters: true }),
  // 6. Has a minimum length of 8 characters
  Validators.minLength(8)])

export const emailValidators = Validators.compose([
  Validators.maxLength(250),
  Validators.minLength(5),
  Validators.required,
  Validators.pattern(/.+@.+\..+/)
]);

export function UserTypeValidator(error: ValidationErrors): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.value) {
      // if control is empty return no error
      return null;
    }
    const validUserTypes = ['customer', 'service_provider'];
    // test the value of the control against the valid values supplied
    // if control value is in valid values, return no error (no error), else return error passed in the second parameter
    return (validUserTypes.indexOf(control.value) > -1) ? null : error;
  };
}

export function getFormValidationErrors(controls: FormGroupControls): AllValidationErrors[] {
  let errors: AllValidationErrors[] = [];
  Object.keys(controls).forEach(key => {
    const control = controls[key];
    if (control instanceof FormGroup) {
      errors = errors.concat(getFormValidationErrors(control.controls));
    }
    const controlErrors: ValidationErrors = controls[key].errors;
    if (controlErrors !== null) {
      Object.keys(controlErrors).forEach(keyError => {
        errors.push({
          control_name: key,
          error_name: keyError,
          error_value: controlErrors[keyError]
        });
      });
    }
  });
  return errors;
}





