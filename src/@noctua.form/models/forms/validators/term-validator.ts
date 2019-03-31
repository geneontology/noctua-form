import { FormGroup, AbstractControl, ValidatorFn } from '@angular/forms';
import { AnnotonNode } from '@noctua.form/models/annoton';

// custom validator to check that two fields match
export function termValidator(termNode: AnnotonNode): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control.value) {
            if (!control.value.id) {
                return { [`Selevt ${termNode.label} correct value`]: { value: control.value } };
            }
        } else {
            return { [`${termNode.label} is required`]: { value: control.value } };
        }
        return null;
    };
}
