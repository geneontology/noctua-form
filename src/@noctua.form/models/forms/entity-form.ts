import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms'

import { Evidence } from './../annoton/evidence'
import { EvidenceForm } from './evidence-form';
import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

import { CamFormMetadata } from './cam-form-metadata'

export class EntityForm {
    term = new FormControl();
    evidenceFormArray = new FormArray([])
    _metadata: CamFormMetadata;
    private _fb = new FormBuilder();

    constructor(metadata) {
        this._metadata = metadata;
    }

    createEvidenceForms(entity) {
        const self = this;

        _.each(entity.evidence, function (evidence: Evidence) {
            let evidenceForm = new EvidenceForm(self._metadata);

            evidenceForm.onValueChanges(evidence.evidence.lookup)
            self.evidenceFormArray.push(self._fb.group(evidenceForm));
        });
    }

    onValueChanges(lookup) {
        const self = this;

        self.term.valueChanges
            .distinctUntilChanged()
            .debounceTime(400)
            .subscribe(data => {
                self._metadata.lookupFunc(data, lookup.requestParams).subscribe(response => {
                    lookup.results = response;
                });
            });
    }
}

