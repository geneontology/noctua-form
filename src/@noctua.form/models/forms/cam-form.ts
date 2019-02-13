import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { merge, Observable, Subscription, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

import { CamFormMetadata } from './../forms/cam-form-metadata';
import { EntityGroupForm } from './entity-group-form'

export class CamForm {
  title = new FormControl();
  state = new FormControl();
  group = new FormControl();
  gp = new FormControl();
  fd = new FormArray([]);

  _metadata: CamFormMetadata;
  autcompleteResults = {
    term: [],
  };

  private _fb = new FormBuilder();

  constructor(metadata) {
    this._metadata = metadata;
  }

  createFunctionDescriptionForm(fdData) {
    const self = this;

    each(fdData, (nodeGroup, nodeKey) => {
      let entityFormGroup = new EntityGroupForm();

      entityFormGroup.name = nodeKey;
      entityFormGroup.createEntityForms(nodeGroup.nodes);
      self.fd.push(self._fb.group(entityFormGroup));
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
