import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Activity } from './../activity/activity';
import { ActivityFormMetadata } from './../forms/activity-form-metadata';
import { EntityForm } from './entity-form';
import { ActivityNode } from '../activity';


export class EntityGroupForm {
    name = '';
    isComplement = false;
    entityForms: EntityForm[] = [];
    entityGroup = new FormArray([]);

    _metadata: ActivityFormMetadata;
    private _fb = new FormBuilder();

    constructor(metadata) {
        this._metadata = metadata;
    }

    createEntityForms(entities: ActivityNode[]) {
        const self = this;

        this.entityForms = [];
        entities.forEach((entity: ActivityNode) => {
            if (entity.visible) {
                const entityForm = new EntityForm(self._metadata, entity);
                if (!entity.skipEvidenceCheck) {
                    entityForm.createEvidenceForms(entity);
                }
                self.entityForms.push(entityForm);
                self.entityGroup.push(self._fb.group(entityForm));
            }
        });
    }

    populateActivityNodes(activity: Activity) {
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

