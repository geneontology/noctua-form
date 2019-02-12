import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

import { EntityGroupForm } from './entity-group-form'

export class CamForm {
  title = new FormControl();
  state = new FormControl();
  group = new FormControl();
  gp = new FormControl();
  fd = new FormArray([]);
  private _fb = new FormBuilder();

  constructor() {
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

}
