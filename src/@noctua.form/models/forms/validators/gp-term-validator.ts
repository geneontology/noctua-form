import { FormGroup, AbstractControl, ValidatorFn } from '@angular/forms';
import { AnnotonNode } from '@noctua.form/models/annoton';

// custom validator to check that two fields match
export function termValidator(termControl: AbstractControl, termNode: AnnotonNode): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        return termControl.value ? { 'Evidence is required': { value: control.value } } : null;
    };



}
