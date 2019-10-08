import { FormControl, FormBuilder, FormArray } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AnnotonFormMetadata } from './../forms/annoton-form-metadata';
import { EvidenceForm } from './evidence-form';

import {
  Triple,
  Evidence,
  EntityLookup,
  Entity
} from '../annoton';
import { AnnotonNode } from '..';

export class TripleForm {
  subject = new FormControl();
  object = new FormControl();
  evidenceForms: EvidenceForm[] = [];
  evidenceFormArray = new FormArray([]);
  _metadata: AnnotonFormMetadata;

  private _fb = new FormBuilder();

  constructor(metadata) {
    this._metadata = metadata;
  }

  createTripleForm(triple: Triple<AnnotonNode>) {
    const self = this;

    this.subject.setValue(triple.subject.getTerm());
    this.object.setValue(triple.object.getTerm());
    this.onValueChanges(triple.subject.termLookup);
    triple.predicate.evidence.forEach((evidence: Evidence) => {
      const evidenceForm = new EvidenceForm(self._metadata, triple.subject, evidence);

      self.evidenceForms.push(evidenceForm);
      evidenceForm.onValueChanges(triple.predicate.evidenceLookup);
      self.evidenceFormArray.push(self._fb.group(evidenceForm));
    });
  }

  populateAnnotonEntityForm(annotonNode: AnnotonNode) {
    const self = this;

    annotonNode.term = new Entity(this.subject.value.id, this.subject.value.label);
    self.evidenceForms.forEach(() => {
      // const evidenceFound = annotonNode.getEvidenceById(evidenceForm.uuid);
      // const evidence = evidenceFound ? evidenceFound : new Evidence();

      //  evidenceForm.populateEvidence(evidence);
      //  evidences.push(evidence)
    });

    // annotonNode.setEvidence(evidences);
  }

  onValueChanges(lookup: EntityLookup) {
    const self = this;

    self.subject.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(400)
    ).subscribe(data => {
      self._metadata.lookupFunc(data, lookup.requestParams).subscribe(response => {
        lookup.results = response;
      });
    });
  }

}
