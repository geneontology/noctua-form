import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms'

import { Evidence } from './../../models/annoton/evidence'
import { EntityForm } from './entity-form';

import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

export class EntityGroupForm {
    name: string = '';
    entityGroup = new FormGroup({});

    private _fb = new FormBuilder();

    constructor() {
    }

    addEntityForms(entities) {
        const self = this;

        each(entities, (entity) => {
            let entityForm = new EntityForm();
            entityForm.createFormEvidence(entity);

            self.entityGroup.addControl(entity.id, self._fb.group(entityForm));
        });
    }
}

