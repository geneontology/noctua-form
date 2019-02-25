import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms'

import { Evidence } from './../../models/annoton/evidence'
import { EntityForm } from './entity-form';

import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

import { Annoton } from './../annoton/annoton';

import { CamFormMetadata } from './../forms/cam-form-metadata';

export class EntityGroupForm {
    name: string = '';
    entityForms: EntityForm[] = []
    entityGroup = new FormGroup({});

    _metadata: CamFormMetadata;
    private _fb = new FormBuilder();

    constructor(metadata) {
        this._metadata = metadata;
    }

    createEntityForms(entities) {
        const self = this;

        this.entityForms = [];
        entities.forEach((entity) => {
            let entityForm = new EntityForm(self._metadata);

            entityForm.id = entity.id;
            this.entityForms.push(entityForm);
            entityForm.createEvidenceForms(entity);
            entityForm.onValueChanges(entity.term.lookup)

            self.entityGroup.addControl(entity.id, self._fb.group(entityForm));
        });
    }

    populateAnnotonNodes(annoton: Annoton) {
        const self = this;

        self.entityForms.forEach((entityForm) => {
            let annotonNode = annoton.getNode(entityForm.id);
            if (annotonNode) {
                entityForm.populateTerm(annotonNode);
            }

        });
    }
}

