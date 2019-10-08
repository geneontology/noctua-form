import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NoctuaFormConfigService } from './config/noctua-form-config.service';
import { NoctuaLookupService } from './lookup.service';
import { Annoton, AnnotonState, AnnotonType } from './../models/annoton/annoton';
import { AnnotonNode } from './../models/annoton/annoton-node';
import { AnnotonForm } from './../models/forms/annoton-form';
import { AnnotonFormMetadata } from './../models/forms/annoton-form-metadata';
import { NoctuaGraphService } from './graph.service';
import { CamService } from './cam.service';
import { Entity } from '../models/annoton/entity';
import { Evidence } from '../models/annoton/evidence';
import { cloneDeep, each } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class NoctuaAnnotonFormService {
  public state: AnnotonState;
  public mfLocation;
  public errors = [];
  public currentAnnoton: Annoton;
  public annoton: Annoton;
  public annotonForm: AnnotonForm;
  public annotonFormGroup: BehaviorSubject<FormGroup | undefined>;
  public annotonFormGroup$: Observable<FormGroup>;
  public cam: any;

  constructor(private _fb: FormBuilder, public noctuaFormConfigService: NoctuaFormConfigService,
    private camService: CamService,
    private noctuaGraphService: NoctuaGraphService,
    private noctuaLookupService: NoctuaLookupService) {

    this.camService.onCamChanged.subscribe((cam) => {
      if (!cam) {
        return;
      }

      this.cam = cam;
    });
    this.annoton = this.noctuaFormConfigService.createAnnotonModel(AnnotonType.default);
    this.annotonFormGroup = new BehaviorSubject(null);
    this.annotonFormGroup$ = this.annotonFormGroup.asObservable();

    this.initializeForm();
  }

  initializeForm(annoton?: Annoton) {
    const self = this;

    self.errors = [];

    if (annoton) {
      self.state = AnnotonState.editing;
      self.currentAnnoton = annoton;
      self.annoton = cloneDeep(annoton);
    } else {
      self.state = AnnotonState.creation;
      self.currentAnnoton = null;
    }

    self.annoton.resetPresentation();
    self.annotonForm = this.createAnnotonForm();
    self.annotonFormGroup.next(this._fb.group(this.annotonForm));
    self.annoton.updateEntityInsertMenu();
    self.annoton.enableSubmit();
    self._onAnnotonFormChanges();
  }

  initializeFormData() {
    //  this.annoton = this.noctuaFormConfigService.createAnnotonModelFakeData(nodes);

    this.fakester(this.annoton);
    this.initializeForm();
  }

  createAnnotonForm() {
    const self = this;
    const annotonFormMetadata = new AnnotonFormMetadata(self.noctuaLookupService.golrLookup.bind(self.noctuaLookupService));
    const annotonForm = new AnnotonForm(annotonFormMetadata);

    annotonForm.createFunctionDescriptionForm(self.annoton.presentation.fd);
    annotonForm.createMolecularEntityForm(self.annoton.presentation.gp);

    console.log(annotonForm);

    return annotonForm;
  }

  annotonFormToAnnoton() {
    this.annotonForm.populateAnnoton(this.annoton);

    if (this.annoton.annotonType === AnnotonType.bpOnly) {
      //const mfNode = this.annotonNode
    }
  }

  private _onAnnotonFormChanges(): void {
    this.annotonFormGroup.getValue().valueChanges.subscribe(() => {
      this.annotonFormToAnnoton();
      this.annoton.enableSubmit();
    });
  }

  getAnnotonFormErrors() {
    let errors = [];

    this.annotonForm.getErrors(errors);

    return errors;
  }

  setAnnotonType(annotonType: AnnotonType) {
    this.annoton = this.noctuaFormConfigService.createAnnotonModel(annotonType);
    this.initializeForm();
  }

  linkFormNode(entity, srcNode) {
    entity.uuid = srcNode.uuid;
    entity.term = srcNode.getTerm();
  }

  cloneForm(srcAnnoton, filterNodes) {
    this.annoton = this.noctuaFormConfigService.createAnnotonModel(
      srcAnnoton.annotonType
    );

    if (filterNodes) {
      each(filterNodes, function (srcNode) {

        //this.complexAnnotonData.molecularEntitys = srcAnnoton.complexAnnotonData.molecularEntitys;
        // this.complexAnnotonData.mcNode.copyValues(srcAnnoton.complexAnnotonData.mcNode);

        let destNode = this.annoton.getNode(srcNode.id);
        if (destNode) {
          destNode.copyValues(srcNode);
        }
      })
    } else {
      // this.annoton.copyValues(srcAnnoton);
    }

    this.initializeForm();
  }

  saveAnnoton() {
    const self = this;
    self.annotonFormToAnnoton();

    if (self.state === AnnotonState.editing) {
      const saveData = self.annoton.createEdit(self.currentAnnoton);

      return self.noctuaGraphService.editAnnoton(self.cam,
        saveData.srcNodes,
        saveData.destNodes,
        saveData.srcTriples,
        saveData.destTriples,
        saveData.removeIds,
        saveData.removeTriples);
    } else { // creation
      const saveData = self.annoton.createSave();
      return self.noctuaGraphService.saveAnnoton(self.cam, saveData.triples, saveData.title);
    }
  }

  clearForm() {
    this.annoton = this.noctuaFormConfigService.createAnnotonModel(
      this.annoton.annotonType
    );

    this.initializeForm();
  }


  fakester(annoton: Annoton) {
    const self = this;

    each(annoton.nodes, (node: AnnotonNode) => {
      self.noctuaLookupService.golrLookup('a', Object.assign({}, node.termLookup.requestParams, { rows: 100 })).subscribe(response => {
        if (response && response.length > 0) {
          const termsCount = response.length;
          console.log(termsCount)
          node.term = Entity.createEntity(response[Math.floor(Math.random() * termsCount)]);

          each(node.predicate.evidence, (evidence: Evidence) => {
            self.noctuaLookupService.golrLookup('a', Object.assign({}, node.predicate.evidenceLookup.requestParams, { rows: 100 })).subscribe(response => {
              if (response && response.length > 0) {
                const evidenceCount = response.length;
                console.log(evidenceCount);
                evidence.evidence = Entity.createEntity(response[Math.floor(Math.random() * evidenceCount)]);
                evidence.reference = `PMID:${Math.floor(Math.random() * 1000000) + 1000}`;
              }
            });
          });
        }
      });
    });
  }

}

