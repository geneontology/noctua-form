import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivityNode } from './../../..//models/activity';

export function evidenceValidator(termNode: ActivityNode): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (termNode && termNode.hasValue()) {
            if (control.value) {
                if (!control.value.id) {
                    return { [`Select correct evidence for "${termNode.label}" correct value`]: { value: control.value } };
                }
            } else {
                return { [`Evidence for "${termNode.label}" is required`]: { value: control.value } };
            }
        }
        return null;
    };
}
