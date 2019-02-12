import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms'

import { Evidence } from './../annoton/evidence'
import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

export class EvidenceForm {
    evidence = new FormControl();
    reference = new FormControl();
    with = new FormControl();

    constructor() {
    }

    createFormEvidence(entity): FormGroup[] {
        const self = this;
        let evidenceGroup: FormGroup[] = [];

        _.each(entity.evidence, function (evidence: Evidence) {
            let srcEvidence: FormGroup = new FormGroup({
                evidence: new FormControl(evidence.getEvidence()),
                reference: new FormControl(evidence.getReference()),
                with: new FormControl(evidence.getWith()),
            })
            evidenceGroup.push(srcEvidence);

            //    self.addOnEvidenceValueChanges(srcEvidence)
        });

        return evidenceGroup;
    }
}

