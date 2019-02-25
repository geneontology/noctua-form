import { Injector, Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs'
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms'

//Config
import { noctuaFormConfig } from './../noctua-form-config';
import { NoctuaFormConfigService } from './config/noctua-form-config.service';
import { NoctuaLookupService } from './lookup.service';

import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

import { Annoton } from '@noctua.form/models/annoton/annoton';
import { AnnotonNode } from '@noctua.form/models/annoton/annoton-node';

import { AnnotonConnectorForm } from './../models/forms/annoton-connector-form';

import { EntityForm } from './../models/forms/entity-form';
import { CamFormMetadata } from './../models/forms/cam-form-metadata';

@Injectable({
  providedIn: 'root'
})
export class NoctuaAnnotonConnectorService {
  public annoton: Annoton;
  public annotonPresentation;
  private connectorForm: AnnotonConnectorForm;
  private connectorFormGroup: BehaviorSubject<FormGroup | undefined>;
  public connectorFormGroup$: Observable<FormGroup>;

  constructor(private _fb: FormBuilder, private noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaLookupService: NoctuaLookupService) {

    this.annoton = this.noctuaFormConfigService.createAnnotonConnectorModel();
    this.connectorFormGroup = new BehaviorSubject(null);
    this.connectorFormGroup$ = this.connectorFormGroup.asObservable()

    this.initalizeForm();
  }

  initalizeForm(annoton?: Annoton) {
    if (annoton) {
      this.annoton = annoton;
    }
    this.connectorForm = this.createConnectorForm()
    this.connectorFormGroup.next(this._fb.group(this.connectorForm));
  }

  createConnectorForm() {
    const self = this;
    let connectorFormMetadata = new CamFormMetadata(self.noctuaLookupService.golrLookup.bind(self.noctuaLookupService));
    let connectorForm = new AnnotonConnectorForm(connectorFormMetadata);

    connectorForm.createEntityForms(self.annoton.getNode('mf'));

    return connectorForm;
  }

  connectorFormToAnnoton(annoton: Annoton, connectorForm) {
    const self = this;

    //self.connectorForm.populateAnnoton(annoton);

    console.dir(annoton)
  }


  clearForm() {
    this.annoton = this.noctuaFormConfigService.createAnnotonModel(
      this.annoton.annotonType,
      this.annoton.annotonModelType
    )
    this.initalizeForm();
  }
}

