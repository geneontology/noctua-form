import { FormControl, FormBuilder, FormArray } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ActivityFormMetadata } from './../forms/activity-form-metadata';
import { EvidenceForm } from './evidence-form';

import {
  Triple,
  Evidence,
  EntityLookup,
  Entity
} from '../activity';
import { ActivityNode } from '..';

export class TripleForm {
  subject = new FormControl();
  object = new FormControl();
  evidenceForms: EvidenceForm[] = [];
  evidenceFormArray = new FormArray([]);
  _metadata: ActivityFormMetadata;

  private _fb = new FormBuilder();

  constructor(metadata) {
    this._metadata = metadata;
  }

  createTripleForm(triple: Triple<ActivityNode>) {
    const self = this;

    this.subject.setValue(triple.subject.getTerm());
    this.object.setValue(triple.object.getTerm());
    this.onValueChanges(triple.subject.termLookup);
    triple.predicate.evidence.forEach((evidence: Evidence) => {
      const evidenceForm = new EvidenceForm(self._metadata, triple.subject, evidence);

      self.evidenceForms.push(evidenceForm);
      evidenceForm.onValueChanges(triple.predicate);
      self.evidenceFormArray.push(self._fb.group(evidenceForm));
    });
  }

  populateActivityEntityForm(activityNode: ActivityNode) {
    const self = this;

    activityNode.term = new Entity(this.subject.value.id, this.subject.value.label);
    self.evidenceForms.forEach(() => {
      // const evidenceFound = activityNode.getEvidenceById(evidenceForm.uuid);
      // const evidence = evidenceFound ? evidenceFound : new Evidence();

      //  evidenceForm.populateEvidence(evidence);
      //  evidences.push(evidence)
    });

    // activityNode.setEvidence(evidences);
  }

  onValueChanges(lookup: EntityLookup) {
    const self = this;

    self.subject.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(400)
    ).subscribe(data => {
      self._metadata.lookupFunc.termLookup(data, lookup.requestParams).subscribe(response => {
        lookup.results = response;
      });
    });
  }

}
