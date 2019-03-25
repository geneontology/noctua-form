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

import { Cam } from './../models/annoton/cam';
import { Annoton } from './../models/annoton/annoton';
import { AnnotonNode } from './../models/annoton/annoton-node';

import { AnnotonEntityForm } from './../models/forms/annoton-entity-form';

import { EntityForm } from './../models/forms/entity-form';
import { AnnotonFormMetadata } from './../models/forms/annoton-form-metadata';

@Injectable({
  providedIn: 'root'
})
export class NoctuaAnnotonEntityService {
  cam: Cam;
  public annoton: Annoton;
  public termNode: AnnotonNode;
  private annotonEntityForm: AnnotonEntityForm;
  private annotonEntityFormGroup: BehaviorSubject<FormGroup | undefined>;
  public annotonEntityFormGroup$: Observable<FormGroup>;

  constructor(private _fb: FormBuilder, public noctuaFormConfigService: NoctuaFormConfigService,
    private camService: CamService,
    private noctuaLookupService: NoctuaLookupService) {

    this.annotonEntityFormGroup = new BehaviorSubject(null);
    this.annotonEntityFormGroup$ = this.annotonEntityFormGroup.asObservable()

    this.camService.onCamChanged.subscribe((cam) => {
      this.cam = cam;
    });
  }

  initializeForm(annoton: Annoton, termNode: AnnotonNode) {
    this.annoton = annoton;
    this.termNode = termNode;
    this.annotonEntityForm = this.createAnnotonEntityForm(termNode);
    this.annotonEntityFormGroup.next(this._fb.group(this.annotonEntityForm));
  }

  createAnnotonEntityForm(termNode: AnnotonNode) {
    const self = this;
    let annotonFormMetadata = new AnnotonFormMetadata(self.noctuaLookupService.golrLookup.bind(self.noctuaLookupService));
    let annotonEntityForm = new AnnotonEntityForm(annotonFormMetadata);

    annotonEntityForm.createAnnotonEntityForms(termNode);

    return annotonEntityForm;
  }

  annotonEntityFormToAnnoton() {
    const self = this;

    self.annotonEntityForm.populateAnnotonEntityForm(this.termNode);
  }

  clearForm() {
  }
}

