import { AbstractControl, ValidationErrors } from '@angular/forms';

export function mongodbNameValidator(control: AbstractControl): ValidationErrors | null {
  const dbName = control.value;

  if (!dbName) {
    return null;
  }

  const isValidLength = dbName.length >= 1 && dbName.length <= 63;
  const invalidCharsRegex = /[^\w.]/;
  const reservedNames = ['admin', 'local', 'config'];

  if (!isValidLength) {
    return { invalidLength: true };
  }

  if (invalidCharsRegex.test(dbName)) {
    return { invalidCharacters: true };
  }

  if (reservedNames.includes(dbName)) {
    return { reservedName: true };
  }

  return null;
}
