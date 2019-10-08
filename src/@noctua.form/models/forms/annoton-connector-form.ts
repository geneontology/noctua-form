import { FormControl, FormBuilder, FormArray } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AnnotonNode } from './../annoton/annoton-node';
import { AnnotonFormMetadata } from './../forms/annoton-form-metadata';
import { EvidenceForm } from './evidence-form';
import { Evidence } from './../../models/annoton/evidence';
import { EntityLookup } from '../annoton/entity-lookup';
import { Predicate } from '..';

export class AnnotonConnectorForm {
  edge = new FormControl();
  annotonsConsecutive = new FormControl();
  causalEffect = new FormControl();
  effectDependency = new FormControl();
  causalReactionProduct = new FormControl();
  evidenceForms: EvidenceForm[] = [];
  evidenceFormArray = new FormArray([]);
  process = new FormControl();
  hasInput = new FormControl();
  _metadata: AnnotonFormMetadata;

  private _fb = new FormBuilder();

  constructor(metadata) {
    this._metadata = metadata;
  }

  createEntityForms(predicate: Predicate, hasInput: AnnotonNode) {
    const self = this;

    this.hasInput.setValue(hasInput.getTerm());

    predicate.evidence.forEach((evidence: Evidence) => {
      const evidenceForm = new EvidenceForm(self._metadata, null, evidence);
      self.evidenceForms.push(evidenceForm);
      evidenceForm.onValueChanges(predicate.evidenceLookup);
      self.evidenceFormArray.push(self._fb.group(evidenceForm));
    });
  }

  updateEvidenceForms(predicate: Predicate) {
    const self = this;

    self.evidenceForms = [];
    self.evidenceFormArray = new FormArray([]);

    predicate.evidence.forEach((evidence: Evidence) => {
      const evidenceForm = new EvidenceForm(self._metadata, null, evidence);
      self.evidenceForms.push(evidenceForm);
      evidenceForm.onValueChanges(predicate.evidenceLookup);
      self.evidenceFormArray.push(self._fb.group(evidenceForm));
    });
  }

  populateConnectorForm() {
    const self = this;
    const evidences: Evidence[] = [];

    self.evidenceForms.forEach((evidenceForm: EvidenceForm) => {
      const evidence = new Evidence();
      evidenceForm.populateEvidence(evidence);
      evidences.push(evidence);
    });
  }

  onValueChanges(lookup: EntityLookup) {
    const self = this;

    self.hasInput.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(400)
    ).subscribe(data => {
      self._metadata.lookupFunc(data, lookup.requestParams).subscribe(response => {
        lookup.results = response;
      });
    });
  }
}
