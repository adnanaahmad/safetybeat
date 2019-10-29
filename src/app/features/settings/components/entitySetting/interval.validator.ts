import {AbstractControl} from '@angular/forms';

export function ValidateInterval(control: AbstractControl) {
  if (control.value === 0) {
    return {validInterval: true};
  }
  return null;
}
