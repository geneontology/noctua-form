import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { merge, Observable, Subscription, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

import { Annoton } from './../annoton/annoton';
import { AnnotonNode } from './../annoton/annoton-node';
import { AnnotonFormMetadata } from './../forms/annoton-form-metadata';
import { EntityGroupForm } from './entity-group-form'

import { EvidenceForm } from './evidence-form';

import { Evidence } from './../../models/annoton/evidence'
import { EntityForm } from './entity-form';

export class AnnotonConnectorForm {
  edge = new FormControl();
  term = new FormControl();
  annotonsConsecutive = new FormControl();
  causalEffect = new FormControl();
  evidenceForms: EvidenceForm[] = []
  evidenceFormArray = new FormArray([])
  _metadata: AnnotonFormMetadata;

  private _fb = new FormBuilder();

  constructor(metadata) {
    this._metadata = metadata;
  }

  createEntityForms(entity: AnnotonNode) {
    const self = this;

    this.term.setValue(entity.getTerm());
    entity.evidence.forEach((evidence: Evidence) => {
      let evidenceForm = new EvidenceForm(self._metadata, entity, evidence);

      self.evidenceForms.push(evidenceForm);
      evidenceForm.onValueChanges(evidence.evidence.lookup)
      self.evidenceFormArray.push(self._fb.group(evidenceForm));
    });
  }

  populateConnectorForm(annoton: Annoton, annotonNode: AnnotonNode) {
    const self = this;

    let evidences: Evidence[] = [];

    self.evidenceForms.forEach((evidenceForm: EvidenceForm) => {
      let evidence = new Evidence()

      evidenceForm.populateEvidence(evidence);
      evidences.push(evidence)
    });
  }

}
