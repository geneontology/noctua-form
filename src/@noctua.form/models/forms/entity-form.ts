import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms'

import { Evidence } from './../annoton/evidence'
import { EvidenceForm } from './evidence-form';
import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

export class EntityForm {
    term = new FormControl();
    evidenceFormArray = new FormArray([])
    private _fb = new FormBuilder();

    constructor() {
    }

    createEvidenceForms(entity) {
        const self = this;

        _.each(entity.evidence, function (evidence: Evidence) {

            let evidenceForm = new EvidenceForm();
            self.evidenceFormArray.push(self._fb.group(evidenceForm));

            //    self.addOnEvidenceValueChanges(srcEvidence)
        });

    }
}

