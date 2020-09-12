import { FormControl, ValidatorFn } from '@angular/forms';

export class StringValidator {
  static noBlank (formControl: FormControl) {
    if((formControl.value||'').trim() === '') {
      return{'blank': true};
    }
    return null;
  }
}
