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
import { EntityLookup } from '../annoton/entity-lookup';
import { Entity } from '../annoton/entity';

export class EvidenceForm {
    uuid;
    evidence = new FormControl();
    reference = new FormControl();
    with = new FormControl();

    _metadata: AnnotonFormMetadata;
    private _term

    constructor(metadata, term: AnnotonNode, evidence: Evidence) {
        this._metadata = metadata;

        this._term = term;

        if (evidence) {
            this.uuid = evidence.uuid;
            this.evidence.setValue(evidence.evidence);
            this.reference.setValue(evidence.reference);
            this.with.setValue(evidence.with);
        }

        this.setEvidenceValidator();
    }

    populateEvidence(evidence: Evidence) {
        evidence.evidence = new Entity(this.evidence.value.id, this.evidence.value.label);
        evidence.reference = this.reference.value;
        evidence.with = this.with.value;
    }

    onValueChanges(lookup: EntityLookup) {
        const self = this;

        self.evidence.valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(400)
        ).subscribe(data => {
            self._metadata.lookupFunc(data, lookup.requestParams).subscribe(response => {
                console.log(response);
                lookup.results = response;
            });
        });
    }

    setEvidenceValidator() {
        this.evidence.setValidators(evidenceValidator(this._term));
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

