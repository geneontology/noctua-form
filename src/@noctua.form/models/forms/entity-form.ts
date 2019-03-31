import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AnnotonNode } from './../annoton/annoton-node';
import { Evidence } from './../annoton/evidence';
import { AnnotonFormMetadata } from './annoton-form-metadata';
import { EvidenceForm } from './evidence-form';
import { termValidator } from './validators/term-validator';

declare const require: any;
const each = require('lodash/forEach');


export class EntityForm {
    id
    term = new FormControl();
    evidenceForms: EvidenceForm[] = []
    evidenceFormArray = new FormArray([])
    _metadata: AnnotonFormMetadata;
    private _fb = new FormBuilder();

    constructor(metadata, id) {
        this._metadata = metadata;
        this.id = id;
    }

    createEvidenceForms(entity: AnnotonNode) {
        const self = this;

        this.term.setValue(entity.getTerm());
        this.setTermValidator(entity);

        entity.evidence.forEach((evidence: Evidence) => {
            let evidenceForm = new EvidenceForm(self._metadata, evidence);

            self.evidenceForms.push(evidenceForm);
            evidenceForm.onValueChanges(evidence.evidence.lookup);
            //  evidenceForm.setTermValidator(termValidator(this.term, entity));
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

    setTermValidator(entity) {
        this.term.setValidators(entity.id === 'mf' ? termValidator(entity) : null);
        //  this.term.setValidators([validatorFn])
    }

    getErrors(error) {
        const self = this;

        if (this.term.errors) {
            error.push(this.term.errors);
        }

        self.evidenceForms.forEach((evidenceForm: EvidenceForm) => {
            evidenceForm.getErrors(error)
        });
    }
}

