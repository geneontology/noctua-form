import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms'
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

import { Evidence } from './../annoton/evidence';
import { AnnotonNode } from './../annoton/annoton-node';
import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

import { AnnotonFormMetadata } from './../forms/annoton-form-metadata';

import { termValidator } from './validators/term-validator';
import { evidenceValidator } from './validators/evidence-validator';

export class EvidenceForm {
    individualId;
    evidence = new FormControl();
    reference = new FormControl();
    with = new FormControl();

    _metadata: AnnotonFormMetadata;
    private _term

    constructor(metadata, term: AnnotonNode, evidence: Evidence) {
        this._metadata = metadata;

        this._term = term;

        if (evidence) {
            this.individualId = evidence.individualId;
            this.evidence.setValue(evidence.getEvidence());
            this.reference.setValue(evidence.getReference());
            this.with.setValue(evidence.getWith());
        }

        this.setEvidenceValidator();
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

    setEvidenceValidator() {
        this.evidence.setValidators(evidenceValidator(this._term))
    }

    getErrors(error) {
        if (this.evidence.errors) {
            error.push(this.evidence.errors);
        }
        if (this.reference.errors) {
            error.push(this.reference.errors);
        }
        if (this.with.errors) {
            error.push(this.with.errors);
        }
    }
}

