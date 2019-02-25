import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { merge, Observable, Subscription, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

import { Annoton } from './../annoton/annoton';
import { AnnotonNode } from './../annoton/annoton-node';
import { CamFormMetadata } from './../forms/cam-form-metadata';
import { EntityGroupForm } from './entity-group-form'

export class CamForm {
  entityGroupForms: EntityGroupForm[] = []
  title = new FormControl();
  state = new FormControl();
  group = new FormControl();
  gp = new FormControl();
  fd = new FormArray([]);

  _metadata: CamFormMetadata;

  private _fb = new FormBuilder();

  constructor(metadata, geneProduct?: AnnotonNode) {
    this._metadata = metadata;

    if (geneProduct) {
      this.gp.setValue(geneProduct.getTerm());
    }
  }

  createFunctionDescriptionForm(fdData) {
    const self = this;

    each(fdData, (nodeGroup, nodeKey) => {
      let entityGroupForm = new EntityGroupForm(this._metadata);

      this.entityGroupForms.push(entityGroupForm);
      entityGroupForm.name = nodeKey;
      entityGroupForm.createEntityForms(nodeGroup.nodes);
      self.fd.push(self._fb.group(entityGroupForm));
    });
  }

  populateAnnoton(annoton: Annoton) {
    annoton.getGPNode().setTerm(this.gp.value);

    this.entityGroupForms.forEach((entityGroupForm: EntityGroupForm) => {
      entityGroupForm.populateAnnotonNodes(annoton);
    });
  }

  onValueChanges(lookup) {
    const self = this;

    self.gp.valueChanges
      .distinctUntilChanged()
      .debounceTime(400)
      .subscribe(data => {
        self._metadata.lookupFunc(data, lookup.requestParams).subscribe(response => {
          lookup.results = response;
          console.log(lookup)
        });
      });
  }
}
