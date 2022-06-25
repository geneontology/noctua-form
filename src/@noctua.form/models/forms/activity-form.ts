import { FormControl, FormBuilder, FormArray } from '@angular/forms';

import { Activity } from './../activity/activity';
import { ActivityFormMetadata } from './../forms/activity-form-metadata';
import { EntityGroupForm } from './entity-group-form';
import { Entity } from './../../models/activity/entity';
import { each } from 'lodash';

export class ActivityForm {
  entityGroupForms: EntityGroupForm[] = [];
  bpOnlyEdge = new FormControl();
  ccOnlyEdge = new FormControl();
  gp = new FormArray([]);
  fd = new FormArray([]);

  private _metadata: ActivityFormMetadata;
  private _fb = new FormBuilder();

  constructor(metadata) {
    this._metadata = metadata;
  }

  createMolecularEntityForm(gpData) {
    const self = this;

    each(gpData, (nodeGroup, nodeKey) => {
      const entityGroupForm = new EntityGroupForm(this._metadata);

      this.entityGroupForms.push(entityGroupForm);
      entityGroupForm.name = nodeKey;
      entityGroupForm.createEntityForms(nodeGroup.nodes);
      self.gp.push(self._fb.group(entityGroupForm));
    });
  }

  createFunctionDescriptionForm(fdData) {
    const self = this;

    each(fdData, (nodeGroup, nodeKey) => {
      const entityGroupForm = new EntityGroupForm(this._metadata);

      this.entityGroupForms.push(entityGroupForm);
      entityGroupForm.name = nodeKey;
      entityGroupForm.isComplement = nodeGroup.isComplement;
      entityGroupForm.createEntityForms(nodeGroup.nodes);
      self.fd.push(self._fb.group(entityGroupForm));
    });
  }

  populateActivity(activity: Activity) {

    this.entityGroupForms.forEach((entityGroupForm: EntityGroupForm) => {
      entityGroupForm.populateActivityNodes(activity);
    });

    if (this.bpOnlyEdge.value) {
      activity.bpOnlyEdge = new Entity(this.bpOnlyEdge.value.id, this.bpOnlyEdge.value.label);
    }
  }

  getErrors(error) {
    this.entityGroupForms.forEach((entityGroupForm: EntityGroupForm) => {
      entityGroupForm.getErrors(error);
    });
  }
}
