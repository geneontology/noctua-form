import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { merge, Observable, Subscription, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

export class AnnotonFormMetadata {
  private _lookupFunc

  constructor(lookupFunc) {
    this._lookupFunc = lookupFunc;
  }

  get lookupFunc() {
    return this._lookupFunc;
  }

}
