import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { merge, Observable, Subscription, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

import { Cam } from './../annoton/cam'
import { Contributor } from './../contributor';
import { Annoton } from './../annoton/annoton';
import { AnnotonNode } from './../annoton/annoton-node';
import { AnnotonFormMetadata } from './../forms/annoton-form-metadata';

export class CamForm {
  title = new FormControl();
  state = new FormControl();
  group = new FormControl();

  _metadata: AnnotonFormMetadata;

  private _fb = new FormBuilder();

  constructor(metadata) {
    this._metadata = metadata;
  }

  createCamForm(cam: Cam, user: Contributor) {
    const self = this;

    if (cam) {
      self.title.setValue(cam.title);
      self.state.setValue(cam.state);
      self.group.setValue(user ? user.group : '');
    }
  }

  getError(error) {

  }

  populateConnectorForm(cam: Cam) {
    const self = this;

    cam.title = self.title.value;
    cam.state = self.state.value;
  }
}
