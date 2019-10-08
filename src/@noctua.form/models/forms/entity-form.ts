import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Evidence } from './../annoton/evidence';
import { AnnotonFormMetadata } from './annoton-form-metadata';
import { EvidenceForm } from './evidence-form';
import { termValidator } from './validators/term-validator';
import { EntityLookup } from '../annoton/entity-lookup';
import { Entity } from './../annoton/entity';
import { AnnotonNode } from './../annoton/annoton-node';

declare const require: any;
const each = require('lodash/forEach');

export class EntityForm {
    id: string;
    node: AnnotonNode;
    term = new FormControl();
    evidenceForms: EvidenceForm[] = [];
    evidenceFormArray = new FormArray([]);
    _metadata: AnnotonFormMetadata;
    private _fb = new FormBuilder();

    constructor(metadata, entity: AnnotonNode) {
        this._metadata = metadata;
        this.id = entity.id;
        this.node = entity;

        this.term.setValue(entity.getTerm());
        this._onValueChanges(entity.termLookup);
    }

    createEvidenceForms(entity: AnnotonNode) {
        const self = this;

        this.setTermValidator(entity);

        entity.predicate.evidence.forEach((evidence: Evidence) => {
            const evidenceForm = new EvidenceForm(self._metadata, entity, evidence);

            self.evidenceForms.push(evidenceForm);
            evidenceForm.onValueChanges(entity.predicate.evidenceLookup);
            //  evidenceForm.setTermValidator(termValidator(this.term, entity));
            self.evidenceFormArray.push(self._fb.group(evidenceForm));
        });
    }

    populateTerm() {
        const self = this;

        if (this.term.value && this.term.value) {
            self.node.term = new Entity(this.term.value.id, this.term.value.label);

            self.evidenceForms.forEach((evidenceForm: EvidenceForm, index: number) => {
                const evidence: Evidence = self.node.predicate.evidence[index];
                if (evidence) {
                    evidenceForm.populateEvidence(evidence);
                }
            });
        }
    }

    private _onValueChanges(lookup: EntityLookup) {
        const self = this;

        console.log(lookup)

        self.term.valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(400)
        ).subscribe(data => {
            self._metadata.lookupFunc(data, lookup.requestParams).subscribe(response => {
                lookup.results = response;
                console.log(lookup.results);
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

