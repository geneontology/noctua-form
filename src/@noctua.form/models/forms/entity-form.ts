import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms'
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Annoton } from './../annoton/annoton';
import { Evidence } from './../annoton/evidence'
import { AnnotonNode } from './../annoton/annoton-node';
import { EvidenceForm } from './evidence-form';
import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

import { CamFormMetadata } from './cam-form-metadata'

export class EntityForm {
    id
    term = new FormControl();
    evidenceForms: EvidenceForm[] = []
    evidenceFormArray = new FormArray([])
    _metadata: CamFormMetadata;
    private _fb = new FormBuilder();

    constructor(metadata, id) {
        this._metadata = metadata;
        this.id = id;
    }

    createEvidenceForms(entity: AnnotonNode) {
        const self = this;

        this.term.setValue(entity.getTerm());

        entity.evidence.forEach((evidence: Evidence) => {
            let evidenceForm = new EvidenceForm(self._metadata, evidence);

            self.evidenceForms.push(evidenceForm);
            evidenceForm.onValueChanges(evidence.evidence.lookup)
            self.evidenceFormArray.push(self._fb.group(evidenceForm));
        });
    }

    populateTerm(annotonNode: AnnotonNode) {
        const self = this;

        let evidences: Evidence[] = []
        annotonNode.setTerm(this.term.value);

        self.evidenceForms.forEach((evidenceForm: EvidenceForm) => {
            let evidence = new Evidence()

            evidenceForm.populateEvidence(evidence);
            evidences.push(evidence)
        });
    }

    onValueChanges(lookup) {
        const self = this;

        self.term.valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(400)
        ).subscribe(data => {
            self._metadata.lookupFunc(data, lookup.requestParams).subscribe(response => {
                lookup.results = response;
            });
        });
    }
}

