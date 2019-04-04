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

import { AnnotonConnectorForm } from './../models/forms/annoton-connector-form';

import { EntityForm } from './../models/forms/entity-form';
import { AnnotonFormMetadata } from './../models/forms/annoton-form-metadata';

@Injectable({
  providedIn: 'root'
})
export class NoctuaAnnotonConnectorService {
  cam: Cam;
  public annoton: Annoton;
  public subjectMFNode: AnnotonNode;
  public objectMFNode: AnnotonNode;
  public subjectAnnoton: Annoton;
  public objectAnnoton: Annoton;
  private connectorForm: AnnotonConnectorForm;
  private connectorFormGroup: BehaviorSubject<FormGroup | undefined>;
  public connectorFormGroup$: Observable<FormGroup>;

  constructor(private _fb: FormBuilder, public noctuaFormConfigService: NoctuaFormConfigService,
    private camService: CamService,
    private noctuaLookupService: NoctuaLookupService) {

    // this.annoton = this.noctuaFormConfigService.createAnnotonConnectorModel();
    this.connectorFormGroup = new BehaviorSubject(null);
    this.connectorFormGroup$ = this.connectorFormGroup.asObservable()

    this.camService.onCamChanged.subscribe((cam) => {
      this.cam = cam;
    });

    // this.initializeForm();
  }

  initializeForm(annoton?: Annoton, edge?) {
    if (annoton) {
      this.annoton = annoton;
    }
    let effect = this.getCausalEffect(edge);

    this.connectorForm = this.createConnectorForm();
    this.connectorForm.causalEffect.setValue(effect.causalEffect);
    this.connectorForm.annotonsConsecutive.setValue(effect.annotonsConsecutive);
    this.connectorFormGroup.next(this._fb.group(this.connectorForm));
    this._onAnnotonFormChanges();
  }

  createConnectorForm() {
    const self = this;
    let connectorFormMetadata = new AnnotonFormMetadata(self.noctuaLookupService.golrLookup.bind(self.noctuaLookupService));
    let connectorForm = new AnnotonConnectorForm(connectorFormMetadata);

    connectorForm.createEntityForms(self.annoton.getNode('mf'));

    return connectorForm;
  }

  createConnection(subjectId, objectId) {
    this.subjectAnnoton = this.cam.getAnnotonByConnectionId(subjectId);
    this.objectAnnoton = this.cam.getAnnotonByConnectionId(objectId);
    this.subjectMFNode = <AnnotonNode>_.cloneDeep(this.subjectAnnoton.getMFNode());
    this.objectMFNode = <AnnotonNode>_.cloneDeep(this.objectAnnoton.getMFNode());

    let edge = this.subjectAnnoton.getConnection(this.objectMFNode.individualId);
    let annoton = this.noctuaFormConfigService.createAnnotonConnectorModel(this.subjectMFNode, this.objectMFNode, edge);

    this.initializeForm(annoton, edge);
  }

  getCausalEffect(edge) {
    let result = {
      causalEffect: this.noctuaFormConfigService.causalEffect.selected,
      edge: this.noctuaFormConfigService.edges.causallyUpstreamOfPositiveEffect,
      annotonsConsecutive: true
    };

    if (edge) {
      result = Object.assign({
        edge: edge.edge
      }, this.noctuaFormConfigService.getCausalEffectByEdge(edge.edge))
    }

    return result;
  }

  connectorFormToAnnoton() {
    const self = this;
    let annotonsConsecutive = self.connectorForm.annotonsConsecutive.value;
    let causalEffect = self.connectorForm.causalEffect.value;
    let edge = self.noctuaFormConfigService.getCausalAnnotonConnectorEdge(causalEffect, annotonsConsecutive);

    self.annoton.editEdge('mf', 'mf-1', edge);
    self.connectorForm.populateConnectorForm(self.annoton, self.subjectMFNode);
  }

  private _onAnnotonFormChanges(): void {
    this.connectorFormGroup.getValue().valueChanges.subscribe(value => {
      // this.errors = this.getAnnotonFormErrors();
      this.connectorFormToAnnoton();
      this.annoton.enableSubmit();
    })
  }

  clearForm() {
  }
}

