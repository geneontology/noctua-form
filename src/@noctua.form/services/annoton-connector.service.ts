import { Injector, Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs'
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms'

//Config
import { noctuaFormConfig } from './../noctua-form-config';
import { NoctuaFormConfigService } from './config/noctua-form-config.service';
import { NoctuaLookupService } from './lookup.service';
import { CamService } from '@noctua.form/services/cam.service';

import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

import { Cam } from '@noctua.form/models/annoton/cam';
import { Annoton } from '@noctua.form/models/annoton/annoton';
import { AnnotonNode } from '@noctua.form/models/annoton/annoton-node';

import { AnnotonConnectorForm } from './../models/forms/annoton-connector-form';

import { EntityForm } from './../models/forms/entity-form';
import { CamFormMetadata } from './../models/forms/cam-form-metadata';

@Injectable({
  providedIn: 'root'
})
export class NoctuaAnnotonConnectorService {
  cam: Cam;
  public annoton: Annoton;
  public subjectMFNode: AnnotonNode;
  public objectMFNode: AnnotonNode;
  public annotonPresentation;
  private connectorForm: AnnotonConnectorForm;
  private connectorFormGroup: BehaviorSubject<FormGroup | undefined>;
  public connectorFormGroup$: Observable<FormGroup>;

  constructor(private _fb: FormBuilder, private noctuaFormConfigService: NoctuaFormConfigService,
    private camService: CamService,
    private noctuaLookupService: NoctuaLookupService) {

    this.annoton = this.noctuaFormConfigService.createAnnotonConnectorModel();
    this.connectorFormGroup = new BehaviorSubject(null);
    this.connectorFormGroup$ = this.connectorFormGroup.asObservable()

    this.camService.onCamChanged.subscribe((cam) => {
      this.cam = cam;
    });

    this.initalizeForm();
  }

  initalizeForm(annoton?: Annoton) {
    if (annoton) {
      this.annoton = annoton;
    }

    this.subjectMFNode = this.annoton.getNode('mf');
    this.objectMFNode = this.annoton.getNode('mf-1');
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

  createConnection(subjectId, objectId, edge?) {
    let subjectAnnoton: Annoton = this.cam.getAnnotonByConnectionId(subjectId);
    let objectAnnoton: Annoton = this.cam.getAnnotonByConnectionId(objectId);

    let subjectMFNode = subjectAnnoton.getMFNode();
    let objectMFNode = objectAnnoton.getMFNode();
    let annoton = this.noctuaFormConfigService.createAnnotonConnectorModel(subjectMFNode, objectMFNode, edge);

    this.initalizeForm(annoton);
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

