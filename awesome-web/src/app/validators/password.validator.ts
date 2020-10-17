import{ AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export class PasswordValidators {
  // static ConfirmedValidator(newPasswordName: string, confirmedPasswordName: string, control: FormGroup) {
  //   let newPassword = control.controls[newPasswordName];
  //   let confirmedPassword = control.controls[confirmedPasswordName];
  //   if(newPassword.value !== confirmedPassword.value) {
  //     return {pwdsDontMatch: true}
  //   }
  //   return null;
  // }
  static ConfirmedValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
          matchingControl.setErrors(null);
        }
    }
}
}
