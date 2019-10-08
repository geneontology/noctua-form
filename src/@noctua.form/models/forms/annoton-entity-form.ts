import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { merge, Observable, Subscription, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

import { Annoton } from './../annoton/annoton';
import { AnnotonFormMetadata } from './../forms/annoton-form-metadata';
import { EntityGroupForm } from './entity-group-form'

import { EvidenceForm } from './evidence-form';

import { Evidence } from './../../models/annoton/evidence'
import { EntityForm } from './entity-form';
import { termValidator } from './validators/term-validator';
import { EntityLookup } from '../annoton/entity-lookup';
import { Entity } from '../annoton/entity';
import { AnnotonNode } from '..';

export class AnnotonEntityForm {
  term = new FormControl();
  evidenceForms: EvidenceForm[] = [];
  evidenceFormArray = new FormArray([]);
  _metadata: AnnotonFormMetadata;

  private _fb = new FormBuilder();

  constructor(metadata) {
    this._metadata = metadata;
  }

  createAnnotonEntityForms(entity: AnnotonNode) {
    const self = this;

    this.term.setValue(entity.getTerm());
    this.term.setValidators(entity.id === 'mf' ? termValidator(entity) : null);
    this.onValueChanges(entity.termLookup);
    entity.predicate.evidence.forEach((evidence: Evidence) => {
      const evidenceForm = new EvidenceForm(self._metadata, entity, evidence);

      self.evidenceForms.push(evidenceForm);
      evidenceForm.onValueChanges(entity.predicate.evidenceLookup);
      self.evidenceFormArray.push(self._fb.group(evidenceForm));
    });
  }



  populateAnnotonEntityForm(annotonNode: AnnotonNode) {
    const self = this;
    let evidences: Evidence[] = [];

    annotonNode.term = new Entity(this.term.value.id, this.term.value.label);
    self.evidenceForms.forEach((evidenceForm: EvidenceForm) => {
      let evidenceFound //nnotonNode.getEvidenceById(evidenceForm.uuid);
      let evidence = evidenceFound ? evidenceFound : new Evidence();

      evidenceForm.populateEvidence(evidence);
      evidences.push(evidence);
    });

    // annotonNode.setEvidence(evidences)
  }

  onValueChanges(lookup: EntityLookup) {
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
