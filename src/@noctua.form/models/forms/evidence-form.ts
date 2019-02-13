import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms'

import { Evidence } from './../annoton/evidence'
import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

import { CamFormMetadata } from './../forms/cam-form-metadata';

export class EvidenceForm {
    evidence = new FormControl();
    reference = new FormControl();
    with = new FormControl();

    _metadata: CamFormMetadata;

    constructor(metadata) {
        this._metadata = metadata;
    }

    onValueChanges(lookup) {
        const self = this;

        self.evidence.valueChanges
            .distinctUntilChanged()
            .debounceTime(400)
            .subscribe(data => {
                self._metadata.lookupFunc(data, lookup.requestParams).subscribe(response => {
                    lookup.results = response;
                });
            });
    }

}

