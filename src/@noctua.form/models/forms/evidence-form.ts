import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms'
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

import { Evidence } from './../annoton/evidence'
import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

import { CamFormMetadata } from './../forms/cam-form-metadata';

export class EvidenceForm {
    evidence = new FormControl();
    reference = new FormControl();
    with = new FormControl();

    _metadata: CamFormMetadata;

    constructor(metadata, evidence?: Evidence) {
        this._metadata = metadata;

        if (evidence) {
            this.evidence.setValue(evidence.getEvidence());
            this.reference.setValue(evidence.getReference());
            this.with.setValue(evidence.getWith());
        }
    }

    populateEvidence(evidence: Evidence) {
        evidence.setEvidence(this.evidence.value);
        evidence.setReference(this.reference.value)
        evidence.setWith(this.with.value)
    }

    onValueChanges(lookup) {
        const self = this;

        self.evidence.valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(400)
        ).subscribe(data => {
            self._metadata.lookupFunc(data, lookup.requestParams).subscribe(response => {
                console.log(0)
                lookup.results = response;
            });
        });
    }

}

