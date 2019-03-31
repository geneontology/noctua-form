import { FormBuilder, FormGroup } from '@angular/forms';
import { Annoton } from './../annoton/annoton';
import { AnnotonFormMetadata } from './../forms/annoton-form-metadata';
import { EntityForm } from './entity-form';


declare const require: any;
const each = require('lodash/forEach');



export class EntityGroupForm {
    name: string = '';
    entityForms: EntityForm[] = []
    entityGroup = new FormGroup({});

    _metadata: AnnotonFormMetadata;
    private _fb = new FormBuilder();

    constructor(metadata) {
        this._metadata = metadata;
    }

    createEntityForms(entities) {
        const self = this;

        this.entityForms = [];
        entities.forEach((entity) => {
            let entityForm = new EntityForm(self._metadata, entity.id);

            this.entityForms.push(entityForm);
            entityForm.createEvidenceForms(entity);
            entityForm.onValueChanges(entity.term.lookup)

            self.entityGroup.addControl(entity.id, self._fb.group(entityForm));
        });
    }

    populateAnnotonNodes(annoton: Annoton) {
        const self = this;

        self.entityForms.forEach((entityForm: EntityForm) => {
            let annotonNode = annoton.getNode(entityForm.id);
            if (annotonNode) {
                entityForm.populateTerm(annotonNode);
            }

        });
    }

    getErrors(error) {
        const self = this;

        self.entityForms.forEach((entityForm: EntityForm) => {
            entityForm.getErrors(error);
        });
    }
}

