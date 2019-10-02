import { Component, Inject, Input, OnInit, ElementRef, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatDrawer } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, Subscription, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';


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
  AnnotonState,
  AnnotonType,
} from 'noctua-form-base';

@Component({
  selector: 'noc-annoton-form',
  templateUrl: './annoton-form.component.html',
  styleUrls: ['./annoton-form.component.scss'],
})

export class AnnotonFormComponent implements OnInit, OnDestroy {
  AnnotonState = AnnotonState;
  AnnotonType = AnnotonType;

  @Input('panelDrawer')
  panelDrawer: MatDrawer;

  cam: Cam;
  annotonFormGroup: FormGroup;
  annotonFormSub: Subscription;

  molecularEntity: FormGroup;

  searchCriteria: any = {};
  annotonFormPresentation: any;
  evidenceFormArray: FormArray;
  annotonFormData: any = [];
  annoton: Annoton;
  currentAnnoton: Annoton;
  state: AnnotonState;

  private _unsubscribeAll: Subject<any>;

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
    this._unsubscribeAll = new Subject();

    // this.annoton = self.noctuaAnnotonFormService.annoton;
    //  this.annotonFormPresentation = this.noctuaAnnotonFormService.annotonPresentation;
  }

  ngOnInit(): void {
    this.annotonFormSub = this.noctuaAnnotonFormService.annotonFormGroup$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(annotonFormGroup => {
        if (!annotonFormGroup) {
          return;
        }

        this.annotonFormGroup = annotonFormGroup;
        this.currentAnnoton = this.noctuaAnnotonFormService.currentAnnoton;
        this.annoton = this.noctuaAnnotonFormService.annoton;
        this.state = this.noctuaAnnotonFormService.state;
        this.molecularEntity = <FormGroup>this.annotonFormGroup.get('molecularEntity');

        console.log(this.annotonFormGroup)
      });

    this.camService.onCamChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cam) => {
        if (!cam) {
          return;
        }

        this.cam = cam;
        this.cam.onGraphChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((annotons) => {
          });
      });
  }

  checkErrors() {
    const errors = this.noctuaAnnotonFormService.annoton.submitErrors;
    this.noctuaFormDialogService.openAnnotonErrorsDialog(errors);
  }

  save() {
    const self = this;

    self.noctuaAnnotonFormService.saveAnnoton().then((data) => {
      self.noctuaFormDialogService.openSuccessfulSaveToast('Activity successfully created.', 'OK');
      self.noctuaAnnotonFormService.clearForm();
    });
  }

  preview() {
    this.noctuaAnnotonFormService.annoton.setPreview();
  }

  clear() {
    this.noctuaAnnotonFormService.clearForm();
  }

  createExample() {
    const self = this;

    self.noctuaAnnotonFormService.initializeFormData();
  }

  termDisplayFn(term): string | undefined {
    return term ? term.label : undefined;
  }

  close() {
    this.panelDrawer.close();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
