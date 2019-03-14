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

import { noctuaAnimations } from '@noctua/animations';
import { NoctuaUtils } from '@noctua/utils/noctua-utils';

import { takeUntil } from 'rxjs/internal/operators';
import { forEach } from '@angular/router/src/utils/collection';

import { NoctuaFormService } from '../../../services/noctua-form.service';

import { NoctuaGraphService } from 'noctua-form-base';
import { NoctuaFormGridService } from 'noctua-form-base';
import { NoctuaFormConfigService } from 'noctua-form-base';
import { NoctuaLookupService } from 'noctua-form-base';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';
import { CamService } from 'noctua-form-base';
import { CamDiagramService } from './../../cam-diagram/services/cam-diagram.service';
import { CamTableService } from './../../cam-table/services/cam-table.service';

import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

import { Cam } from 'noctua-form-base';
import { Annoton } from 'noctua-form-base';
import { AnnotonNode } from 'noctua-form-base';
import { Evidence } from 'noctua-form-base';

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
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaFormGridService: NoctuaFormGridService,
    private noctuaLookupService: NoctuaLookupService,
    public noctuaFormService: NoctuaFormService,
    private sparqlService: SparqlService
  ) {
    this.unsubscribeAll = new Subject();
    // this.annoton = self.noctuaFormGridService.annoton;
    //  this.annotonFormPresentation = this.noctuaFormGridService.annotonPresentation;
  }

  ngOnInit(): void {
    this.annotonFormSub = this.noctuaFormGridService.annotonFormGroup$
      .subscribe(annotonFormGroup => {
        if (!annotonFormGroup) return;
        this.annotonFormGroup = annotonFormGroup;

        console.log(this.annotonFormGroup)
      });

    this.camService.onCamChanged.subscribe((cam) => {
      this.cam = cam

      this.cam.onGraphChanged.subscribe((annotons) => {
        //console.log("cam changed")
        //  let data = this.summaryGridService.getGrid(annotons);
        //  this.sparqlService.addCamChildren(cam, data);
        //  this.dataSource = new CamsDataSource(this.sparqlService, this.paginator, this.sort);
      });
    });
  }

  save() {
    const self = this;
    let infos;

    self.noctuaFormGridService.annotonFormToAnnoton(self.noctuaFormGridService.annoton)

    let saveAnnoton = function () {
      //self.formGrid.linkFormNode(entity, selected.node);
      let annoton = self.noctuaGraphService.adjustAnnoton(self.noctuaFormGridService.annoton)
      self.noctuaGraphService.saveAnnoton(self.cam, annoton).then((data) => {
        //  localStorage.setItem('barista_token', value);
        self.noctuaFormGridService.clearForm();
        // self.dialogService.openSuccessfulSaveToast();
      });
    }

    infos = self.noctuaGraphService.annotonAdjustments(self.noctuaFormGridService.annoton);
    // self.graph.createSave(self.formGrid.annoton);
    //temporarily off
    if (infos.length > 0) {
      let data = {
        annoton: self.noctuaFormGridService.annoton,
        infos: infos
      };

      // self.dialogService.openBeforeSaveDialog(null, data, saveAnnoton);
      /// saveAnnoton();
    } else {
      saveAnnoton();
    }
  }

  clear() {
    this.noctuaFormGridService.clearForm();
  }

  createExample(example) {
    const self = this;

    self.noctuaFormGridService.initializeFormData(example);
  }

  changeAnnotonTypeForm(annotonType) {
    const self = this;

    self.noctuaFormGridService.setAnnotonType(self.noctuaFormGridService.annoton, annotonType.name);
  }

  changeAnnotonModelTypeForm(annotonModelType) {
    const self = this;

    self.noctuaFormGridService.setAnnotonModelType(self.noctuaFormGridService.annoton, annotonModelType.name);
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
