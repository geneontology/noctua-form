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

import { CamForm } from './../models/forms/cam-form';
import { CamFormMetadata } from './../models/forms/cam-form-metadata';

@Injectable({
  providedIn: 'root'
})
export class NoctuaFormGridService {
  public annoton;
  public annotonPresentation;
  private camForm: BehaviorSubject<FormGroup | undefined>;

  camForm$: Observable<FormGroup>;
  constructor(private _fb: FormBuilder, private noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaLookupService: NoctuaLookupService) {
    this.annoton = this.noctuaFormConfigService.createAnnotonModel(
      noctuaFormConfig.annotonType.options.simple.name,
      noctuaFormConfig.annotonModelType.options.default.name
    );

    this.camForm = new BehaviorSubject(null);
    this.camForm$ = this.camForm.asObservable()

    this.initalizeForm();
  }

  initalizeForm() {
    this.annotonPresentation = this.getAnnotonPresentation(this.annoton);
    let camForm = this.createCamForm();

    // const currentTeam = this.camForm.getValue();
    // 
    this.camForm.next(this._fb.group(camForm));

  }

  createCamForm() {
    const self = this;

    let camFormMetadata = new CamFormMetadata(self.noctuaLookupService.golrLookup.bind(self.noctuaLookupService));
    let camForm = new CamForm(camFormMetadata);

    camForm.createFunctionDescriptionForm(self.annotonPresentation.fd);
    camForm.onValueChanges(self.annotonPresentation.geneProduct.term.lookup);

    //self.camFormData = self.noctuaFormConfigService.createReviewSearchFormData();

    return camForm;
  }

  setAnnotonType(annoton, annotonType) {
    annoton.setAnnotonType(annotonType.name);

    this.annoton = this.noctuaFormConfigService.createAnnotonModel(
      annotonType,
      annoton.annotonModelType,
      annoton
    )
    this.initalizeForm();
  }

  setAnnotonModelType(annoton, annotonModelType) {
    this.annoton = this.noctuaFormConfigService.createAnnotonModel(
      annoton.annotonType,
      annotonModelType,
      annoton)
    this.initalizeForm();
  }

  getAnnotonPresentation(annoton) {
    let result = {
      geneProduct: annoton.getNode('gp'),
      mcNode: annoton.getNode('mc'),
      gp: {},
      fd: {},
      extra: []
    }

    each(annoton.nodes, function (node) {
      if (node.displaySection && node.displayGroup) {
        if (!result[node.displaySection.id][node.displayGroup.id]) {
          result[node.displaySection.id][node.displayGroup.id] = {
            shorthand: node.displayGroup.shorthand,
            label: node.displayGroup.label,
            nodes: []
          };
        }
        result[node.displaySection.id][node.displayGroup.id].nodes.push(node);
        node.nodeGroup = result[node.displaySection.id][node.displayGroup.id];
        if (node.isComplement) {
          node.nodeGroup.isComplement = true;
        }
      }
    });

    return result;
  }

  addAnnotonPresentation(annoton, displaySectionId) {
    let result = {};
    result[displaySectionId] = {};

    each(annoton.nodes, function (node) {
      if (node.displaySection === displaySectionId && node.displayGroup) {
        if (!result[displaySectionId][node.displayGroup.id]) {
          result[displaySectionId][node.displayGroup.id] = {
            shorthand: node.displayGroup.shorthand,
            label: node.displayGroup.label,
            nodes: []
          };
        }
        result[displaySectionId][node.displayGroup.id].nodes.push(node);
        node.nodeGroup = result[displaySectionId][node.displayGroup.id];
        if (node.isComplement) {
          node.nodeGroup.isComplement = true;
        }
      }
    });

    this.annotonPresentation.extra.push(result);

    return result[displaySectionId];
  }



  addGPNode(annoton) {
    let id = 'gp-' + annoton.nodes.length;

    this.noctuaFormConfigService.addGPAnnotonData(annoton, id);
  }

  initalizeFormData() {
    this.annoton = this.noctuaFormConfigService.createAnnotonModelFakeData();
    this.initalizeForm();
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

    this.initalizeForm();
  }


  clearForm() {
    this.annoton = this.noctuaFormConfigService.createAnnotonModel(
      this.annoton.annotonType,
      this.annoton.annotonModelType
    )
    this.initalizeForm();
  }
}

