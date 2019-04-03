import { Component, Inject, Input, OnInit, ElementRef, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatDrawer } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, Subscription, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';


import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

import { noctuaAnimations } from './../../../../../../../@noctua/animations';
import { NoctuaFormService } from '../../../services/noctua-form.service';

import { NoctuaSearchService } from './../../../../../../../@noctua.search/services/noctua-search.service';
import { CamDiagramService } from './../../cam-diagram/services/cam-diagram.service';
import { CamTableService } from './../../cam-table/services/cam-table.service';

import { SparqlService } from './../../../../../../../@noctua.sparql/services/sparql/sparql.service';
import { NoctuaFormDialogService } from './../../../services/dialog.service';
import {
  Cam,
  Annoton,
  AnnotonNode,
  Evidence,
  CamService,
  NoctuaGraphService,
  NoctuaAnnotonFormService,
  NoctuaFormConfigService,
  NoctuaLookupService,
} from 'noctua-form-base';

@Component({
  selector: 'noc-annoton-form',
  templateUrl: './annoton-form.component.html',
  styleUrls: ['./annoton-form.component.scss'],
})

export class AnnotonFormComponent implements OnInit, OnDestroy {

  @Input('panelDrawer')
  panelDrawer: MatDrawer;
  cam: Cam;
  annotonFormGroup: FormGroup;
  annotonFormSub: Subscription;

  searchCriteria: any = {};
  annotonFormPresentation: any;
  //annotonForm: FormGroup;
  evidenceFormArray: FormArray;
  annotonFormData: any = []
  // annoton: Annoton = new Annoton();

  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    private camService: CamService,
    private formBuilder: FormBuilder,
    private noctuaSearchService: NoctuaSearchService,
    private camDiagramService: CamDiagramService,
    public camTableService: CamTableService,
    private noctuaGraphService: NoctuaGraphService,
    private noctuaFormDialogService: NoctuaFormDialogService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaAnnotonFormService: NoctuaAnnotonFormService,
    private noctuaLookupService: NoctuaLookupService,
    public noctuaFormService: NoctuaFormService,
    private sparqlService: SparqlService
  ) {
    this.unsubscribeAll = new Subject();
    // this.annoton = self.noctuaAnnotonFormService.annoton;
    //  this.annotonFormPresentation = this.noctuaAnnotonFormService.annotonPresentation;
  }

  ngOnInit(): void {
    this.annotonFormSub = this.noctuaAnnotonFormService.annotonFormGroup$
      .subscribe(annotonFormGroup => {
        if (!annotonFormGroup) return;
        this.annotonFormGroup = annotonFormGroup;
      });

    this.camService.onCamChanged.subscribe((cam) => {
      this.cam = cam

      this.cam.onGraphChanged.subscribe((annotons) => {
      });
    });
  }

  checkErrors() {
    let errors = this.noctuaAnnotonFormService.annoton.submitErrors;
    this.noctuaFormDialogService.openAnnotonErrorsDialog(errors)
  }

  save() {
    const self = this;
    let infos;

    self.noctuaAnnotonFormService.annotonFormToAnnoton();

    let saveAnnoton = function () {
      //self.annotonForm.linkFormNode(entity, selected.node);
      let annoton = self.noctuaGraphService.adjustAnnoton(self.noctuaAnnotonFormService.annoton)
      self.noctuaGraphService.saveAnnoton(self.cam, annoton).then((data) => {
        //  localStorage.setItem('barista_token', value);
        self.noctuaAnnotonFormService.clearForm();
        // self.dialogService.openSuccessfulSaveToast();
      });
    }

    infos = self.noctuaGraphService.annotonAdjustments(self.noctuaAnnotonFormService.annoton);
    // self.graph.createSave(self.annotonForm.annoton);
    //temporarily off
    if (infos.length > 0) {
      let data = {
        annoton: self.noctuaAnnotonFormService.annoton,
        infos: infos
      };

      // self.dialogService.openBeforeSaveDialog(null, data, saveAnnoton);
      /// saveAnnoton();
    } else {
      saveAnnoton();
    }
  }

  clear() {
    this.noctuaAnnotonFormService.clearForm();
  }

  createExample(example) {
    const self = this;

    self.noctuaAnnotonFormService.initializeFormData(example);
  }

  changeAnnotonTypeForm(annotonType) {
    const self = this;

    self.noctuaAnnotonFormService.setAnnotonType(self.noctuaAnnotonFormService.annoton, annotonType.name);
  }

  changeAnnotonModelTypeForm(annotonModelType) {
    const self = this;

    self.noctuaAnnotonFormService.setAnnotonModelType(self.noctuaAnnotonFormService.annoton, annotonModelType.name);
  }

  termDisplayFn(term): string | undefined {
    return term ? term.label : undefined;
  }

  close() {
    this.panelDrawer.close()
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
