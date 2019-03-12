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

import { Annoton } from './..//models/annoton/annoton';
import { AnnotonNode } from './..//models/annoton/annoton-node';

import { CamForm } from './../models/forms/cam-form';
import { CamFormMetadata } from './../models/forms/cam-form-metadata';

@Injectable({
  providedIn: 'root'
})
export class NoctuaFormGridService {
  public mfLocation;
  public annoton: Annoton;
  // public annotonPresentation;
  private camForm: CamForm;
  private camFormGroup: BehaviorSubject<FormGroup | undefined>;
  public camFormGroup$: Observable<FormGroup>;

  constructor(private _fb: FormBuilder, public noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaLookupService: NoctuaLookupService) {
    this.annoton = this.noctuaFormConfigService.createAnnotonModel(
      noctuaFormConfig.annotonType.options.simple.name,
      noctuaFormConfig.annotonModelType.options.default.name
    );

    this.camFormGroup = new BehaviorSubject(null);
    this.camFormGroup$ = this.camFormGroup.asObservable();

    this.initializeForm();
  }

  initializeForm(annoton?: Annoton) {
    const self = this;

    if (annoton) {
      this.annoton = annoton;
    }

    if (self.mfLocation) {
      let mfNode = self.annoton.getNode('mf');

      if (mfNode) {
        mfNode.location = self.mfLocation;
      }
    }
    this.camForm = this.createCamForm()
    this.camFormGroup.next(this._fb.group(this.camForm));
  }

  initializeFormData(nodes) {
    this.annoton = this.noctuaFormConfigService.createAnnotonModelFakeData(nodes);
    this.initializeForm()
  }

  createCamForm() {
    const self = this;

    let camFormMetadata = new CamFormMetadata(self.noctuaLookupService.golrLookup.bind(self.noctuaLookupService));
    let camForm = new CamForm(camFormMetadata, self.annoton.presentation.geneProduct);

    camForm.createFunctionDescriptionForm(self.annoton.presentation.fd);
    camForm.onValueChanges(self.annoton.presentation.geneProduct.term.lookup);

    //self.camFormData = self.noctuaFormConfigService.createReviewSearchFormData();

    return camForm;
  }

  camFormToAnnoton(annoton: Annoton) {
    const self = this;

    self.camForm.populateAnnoton(annoton);

    console.dir(annoton)
  }

  setAnnotonType(annoton, annotonType) {
    annoton.setAnnotonType(annotonType.name);

    this.annoton = this.noctuaFormConfigService.createAnnotonModel(
      annotonType,
      annoton.annotonModelType,
      annoton
    )
    this.initializeForm();
  }

  setAnnotonModelType(annoton, annotonModelType) {
    this.annoton = this.noctuaFormConfigService.createAnnotonModel(
      annoton.annotonType,
      annotonModelType,
      annoton)
    this.initializeForm();
  }





  addGPNode(annoton) {
    let id = 'gp-' + annoton.nodes.length;

    this.noctuaFormConfigService.addGPAnnotonData(annoton, id);
  }

  linkFormNode(entity, srcNode) {
    entity.modelId = srcNode.modelId;
    entity.setTerm(srcNode.getTerm());
  }

  cloneForm(srcAnnoton, filterNodes) {
    this.annoton = this.noctuaFormConfigService.createAnnotonModel(
      srcAnnoton.annotonType,
      srcAnnoton.annotonModelType
    );

    if (filterNodes) {
      each(filterNodes, function (srcNode) {

        //this.complexAnnotonData.geneProducts = srcAnnoton.complexAnnotonData.geneProducts;
        // this.complexAnnotonData.mcNode.copyValues(srcAnnoton.complexAnnotonData.mcNode);

        let destNode = this.annoton.getNode(srcNode.id);
        if (destNode) {
          destNode.copyValues(srcNode);
        }
      })
    } else {
      this.annoton.copyValues(srcAnnoton);
    }

    this.initializeForm();
  }


  clearForm() {
    this.annoton = this.noctuaFormConfigService.createAnnotonModel(
      this.annoton.annotonType,
      this.annoton.annotonModelType
    )
    this.initializeForm();
  }
}

