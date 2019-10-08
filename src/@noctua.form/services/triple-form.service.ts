import { Injector, Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs'
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms'

//Config
import { noctuaFormConfig } from './../noctua-form-config';
import { NoctuaFormConfigService } from './config/noctua-form-config.service';
import { NoctuaLookupService } from './lookup.service';
import { CamService } from './../services/cam.service';

import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

import {
  Cam,
  Triple,
  AnnotonNode
} from './../models/annoton';
import { } from './../models/annoton/annoton-node';

import { AnnotonEntityForm } from './../models/forms/annoton-entity-form';

import { EntityForm, TripleForm } from './../models/forms';
import { AnnotonFormMetadata } from './../models/forms/annoton-form-metadata';

@Injectable({
  providedIn: 'root'
})
export class NoctuaTripleFormService {
  cam: Cam;
  public triple: Triple<AnnotonNode>;
  private tripleForm: TripleForm;
  private tripleFormGroup: BehaviorSubject<FormGroup | undefined>;
  public tripleFormGroup$: Observable<FormGroup>;

  constructor(private _fb: FormBuilder, public noctuaFormConfigService: NoctuaFormConfigService,
    private camService: CamService,
    private noctuaLookupService: NoctuaLookupService) {

    this.tripleFormGroup = new BehaviorSubject(null);
    this.tripleFormGroup$ = this.tripleFormGroup.asObservable()

    this.camService.onCamChanged.subscribe((cam) => {
      if (!cam) return;

      this.cam = cam;
    });
  }

  initializeForm(triple: Triple<AnnotonNode>) {
    this.triple = triple;
    this.tripleForm = this.createTripleForm(triple);
    this.tripleFormGroup.next(this._fb.group(this.tripleForm));
    this._onAnnotonFormChanges();
  }

  createTripleForm(triple: Triple<AnnotonNode>) {
    const self = this;
    let annotonFormMetadata = new AnnotonFormMetadata(self.noctuaLookupService.golrLookup.bind(self.noctuaLookupService));
    let tripleForm = new TripleForm(annotonFormMetadata);

    tripleForm.createTripleForm(triple);

    return tripleForm;
  }

  tripleFormToAnnoton() {
    const self = this;

    // self.tripleForm.populateAnnotonEntityForm(this.termNode);
  }

  private _onAnnotonFormChanges(): void {
    this.tripleFormGroup.getValue().valueChanges.subscribe(value => {
      // this.errors = this.getAnnotonFormErrors();
      this.tripleFormToAnnoton();
    });
  }

  clearForm() {
  }
}

