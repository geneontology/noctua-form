import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Annoton } from './../annoton/annoton';
import { AnnotonFormMetadata } from './../forms/annoton-form-metadata';
import { EntityForm } from './entity-form';
import { AnnotonNode } from '../annoton';


declare const require: any;
const each = require('lodash/forEach');

export class EntityGroupForm {
    name = '';
    isComplement = false;
    entityForms: EntityForm[] = [];
    entityGroup = new FormArray([]);

    _metadata: AnnotonFormMetadata;
    private _fb = new FormBuilder();

    constructor(metadata) {
        this._metadata = metadata;
    }

    createEntityForms(entities: AnnotonNode[]) {
        const self = this;

        this.entityForms = [];
        entities.forEach((entity: AnnotonNode) => {
            if (entity.visible) {
                const entityForm = new EntityForm(self._metadata, entity);
                if (!entity.skipEvidence) {
                    entityForm.createEvidenceForms(entity);
                }
                self.entityForms.push(entityForm);
                self.entityGroup.push(self._fb.group(entityForm));
            }
        });
    }

    populateAnnotonNodes(annoton: Annoton) {
        const self = this;

        self.entityForms.forEach((entityForm: EntityForm) => {
            entityForm.populateTerm();
        });
    }

    getErrors(error) {
        const self = this;

        self.entityForms.forEach((entityForm: EntityForm) => {
            entityForm.getErrors(error);
        });
    }
}

