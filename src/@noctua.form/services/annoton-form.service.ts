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

import { Annoton } from './../models/annoton/annoton';
import { AnnotonNode } from './../models/annoton/annoton-node';

import { AnnotonForm } from './../models/forms/annoton-form';
import { AnnotonFormMetadata } from './../models/forms/annoton-form-metadata';

@Injectable({
  providedIn: 'root'
})
export class NoctuaAnnotonFormService {
  public mfLocation;
  public annoton: Annoton;
  // public annotonPresentation;
  public annotonForm: AnnotonForm;
  public annotonFormGroup: BehaviorSubject<FormGroup | undefined>;
  public annotonFormGroup$: Observable<FormGroup>;

  constructor(private _fb: FormBuilder, public noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaLookupService: NoctuaLookupService) {
    this.annoton = this.noctuaFormConfigService.createAnnotonModel(
      noctuaFormConfig.annotonType.options.simple.name,
      noctuaFormConfig.annotonModelType.options.default.name
    );

    this.annotonFormGroup = new BehaviorSubject(null);
    this.annotonFormGroup$ = this.annotonFormGroup.asObservable();

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
    this.annotonForm = this.createAnnotonForm()
    this.annotonFormGroup.next(this._fb.group(this.annotonForm));
  }

  initializeFormData(nodes) {
    this.annoton = this.noctuaFormConfigService.createAnnotonModelFakeData(nodes);
    this.initializeForm()
  }

  createAnnotonForm() {
    const self = this;

    let annotonFormMetadata = new AnnotonFormMetadata(self.noctuaLookupService.golrLookup.bind(self.noctuaLookupService));
    let annotonForm = new AnnotonForm(annotonFormMetadata, self.annoton.presentation.geneProduct);

    annotonForm.createFunctionDescriptionForm(self.annoton.presentation.fd);
    annotonForm.onValueChanges(self.annoton.presentation.geneProduct.term.lookup);

    //self.annotonFormData = self.noctuaFormConfigService.createReviewSearchFormData();

    return annotonForm;
  }

  annotonFormToAnnoton(annoton: Annoton) {
    const self = this;

    self.annotonForm.populateAnnoton(annoton);

    console.dir(annoton)
  }

  getAnnotonFormErrors() {
    let errors = [];

    this.annotonForm.getErrors(errors);

    return errors;
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

