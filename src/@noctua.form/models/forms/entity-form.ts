import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Evidence } from './../activity/evidence';
import { ActivityFormMetadata } from './activity-form-metadata';
import { EvidenceForm } from './evidence-form';
import { termValidator } from './validators/term-validator';
import { EntityLookup } from '../activity/entity-lookup';
import { Entity } from './../activity/entity';
import { ActivityNode } from './../activity/activity-node';
import { Predicate } from '../activity';

export class EntityForm {
    id: string;
    node: ActivityNode;
    relationship = new FormControl();
    term = new FormControl();
    evidenceForms: EvidenceForm[] = [];
    evidenceFormArray = new FormArray([]);
    _metadata: ActivityFormMetadata;
    private _fb = new FormBuilder();

    constructor(metadata, entity: ActivityNode) {
        this._metadata = metadata;
        this.id = entity.id;
        this.node = entity;

        this.term.setValue(entity.getTerm());
        this.relationship.setValue(entity.predicate.edge);
        this._onValueChanges(entity.termLookup);
    }

    createEvidenceForms(entity: ActivityNode) {
        const self = this;

        this.setTermValidator(entity);

        entity.predicate.evidence.forEach((evidence: Evidence) => {
            const evidenceForm = new EvidenceForm(self._metadata, entity, evidence);

            self.evidenceForms.push(evidenceForm);
            evidenceForm.onValueChanges(entity.predicate);
            //  evidenceForm.setTermValidator(termValidator(this.term, entity));
            self.evidenceFormArray.push(self._fb.group(evidenceForm));
        });
    }

    refreshEvidenceForms(evidences: Evidence[]) {
        const self = this;

        self.evidenceForms = [];
        self.evidenceFormArray = new FormArray([]);

        evidences.forEach((evidence: Evidence) => {
            const evidenceForm = new EvidenceForm(self._metadata, self.node, evidence);

            self.evidenceForms.push(evidenceForm);
            evidenceForm.onValueChanges(self.node.predicate);
            self.evidenceFormArray.push(self._fb.group(evidenceForm));
        });
    }

    populateTerm() {
        const self = this;

        if (self.relationship.value && self.node.relationEditable) {
            self.node.predicate.edge = self.relationship.value;
        }

        if (self.term.value && self.term.value.id) {
            self.node.term = new Entity(self.term.value.id, self.term.value.label);
            self.node.rootTypes = self.term.value.rootTypes;

            self.evidenceForms.forEach((evidenceForm: EvidenceForm, index: number) => {
                const evidence: Evidence = self.node.predicate.evidence[index];
                if (evidence) {
                    evidenceForm.populateEvidence(evidence);
                }
            });
        }
    }

    populateTermEvidenceOnly() {
        const self = this;

        self.evidenceForms.forEach((evidenceForm: EvidenceForm, index: number) => {
            const evidence: Evidence = self.node.predicate.evidence[index];
            if (evidence) {
                evidenceForm.populateEvidence(evidence);
            }
        });
    }

    private _onValueChanges(lookup: EntityLookup) {
        const self = this;

        self.term.valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(400)
        ).subscribe(data => {
            self._metadata.lookupFunc.termLookup(data, self.node.termLookup.requestParams).subscribe(response => {
                self.node.termLookup.results = response;
            });
        });
    }

    setTermValidator(entity) {
        this.term.setValidators(entity.id === 'mf' ? termValidator(entity) : null);
        //  this.term.setValidators([validatorFn])
    }

    getErrors(error) {
        const self = this;

        if (self.term.errors) {
            error.push(self.term.errors);
        }

        self.evidenceForms.forEach((evidenceForm: EvidenceForm) => {
            evidenceForm.getErrors(error)
        });
    }
}

