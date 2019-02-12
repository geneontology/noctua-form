import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms'

import { Evidence } from './../annoton/evidence'
import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

export class EvidenceForm {
    evidence = new FormControl();
    reference = new FormControl();
    with = new FormControl();

    constructor() {
    }

}

