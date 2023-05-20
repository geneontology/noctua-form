import { FormControl, FormBuilder, FormArray } from '@angular/forms';
import { ActivityFormMetadata } from './../forms/activity-form-metadata';
import { EvidenceForm } from './evidence-form';
import { Evidence } from './../../models/activity/evidence';
import { Predicate } from '..';

export class ActivityConnectorForm {
  edge = new FormControl();
  relationship = new FormControl();
  directness = new FormControl();
  effectDirection = new FormControl();
  evidenceForms: EvidenceForm[] = [];
  evidenceFormArray = new FormArray([]);
  _metadata: ActivityFormMetadata;

  private _fb = new FormBuilder();

  constructor(metadata) {
    this._metadata = metadata;
  }

  createEntityForms(predicate: Predicate) {
    const self = this;

    predicate.evidence.forEach((evidence: Evidence) => {
      const evidenceForm = new EvidenceForm(self._metadata, null, evidence);
      self.evidenceForms.push(evidenceForm);
      evidenceForm.onValueChanges(predicate);
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
      evidenceForm.onValueChanges(predicate);
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


}
