import { FormGroup, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';
import { AnnotonNode } from './../../..//models/annoton';

export function evidenceValidator(termNode: AnnotonNode): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (termNode && termNode.hasValue()) {
            if (control.value) {
                if (!control.value.id) {
                    return { [`Selevt correct evidence for "${termNode.label}" correct value`]: { value: control.value } };
                }
            } else {
                return { [`Evidence for "${termNode.label}" is required`]: { value: control.value } };
            }
        }
        return null;
    };
}
