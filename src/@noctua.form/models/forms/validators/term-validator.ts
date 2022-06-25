import { FormGroup, AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivityNode } from './../../..//models/activity';

export function termValidator(termNode: ActivityNode): ValidatorFn {
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
