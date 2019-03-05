import { Component, Inject, Input, OnInit, ElementRef, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatMenuTrigger } from '@angular/material';
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

import { NoctuaFormService } from '../../services/noctua-form.service';

import { NoctuaAnnotonConnectorService } from '@noctua.form/services/annoton-connector.service';
import { NoctuaGraphService } from '@noctua.form/services/graph.service';
import { NoctuaFormGridService } from '@noctua.form/services/form-grid.service';
import { NoctuaFormConfigService } from '@noctua.form/services/config/noctua-form-config.service';
import { NoctuaLookupService } from '@noctua.form/services/lookup.service';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';
import { CamService } from '@noctua.form/services/cam.service';
import { CamDiagramService } from './../../cam/cam-diagram/services/cam-diagram.service';
import { CamTableService } from './../../cam/cam-table/services/cam-table.service';

import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

import { Cam } from '@noctua.form/models/annoton/cam';
import { Annoton } from '@noctua.form/models/annoton/annoton';
import { AnnotonNode } from '@noctua.form/models/annoton/annoton-node';
import { Evidence } from '@noctua.form/models/annoton/evidence';

@Component({
  selector: 'app-cam-connector',
  templateUrl: './cam-connector.component.html',
  styleUrls: ['./cam-connector.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class CamConnectorDialogComponent implements OnInit, OnDestroy {
  annoton: Annoton;
  mfNode: AnnotonNode;

  cam: Cam;
  connectorFormGroup: FormGroup;
  connectorFormSub: Subscription;

  searchCriteria: any = {};
  evidenceFormArray: FormArray;
  // annoton: Annoton = new Annoton();

  subjectGPNode: AnnotonNode;
  objectGPNode: AnnotonNode;
  selectedCausalEffect;

  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    private _matDialogRef: MatDialogRef<CamConnectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private camService: CamService,
    private formBuilder: FormBuilder,
    private noctuaAnnotonConnectorService: NoctuaAnnotonConnectorService,
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

    this.annoton = this._data.annoton
  }

  ngOnInit(): void {
    this.connectorFormSub = this.noctuaAnnotonConnectorService.connectorFormGroup$
      .subscribe(connectorFormGroup => {
        if (!connectorFormGroup) return;
        this.connectorFormGroup = connectorFormGroup;

        this.subjectGPNode = this.noctuaAnnotonConnectorService.subjectAnnoton.getGPNode()
        this.objectGPNode = this.noctuaAnnotonConnectorService.objectAnnoton.getGPNode()

        this.selectedCausalEffect = this.connectorFormGroup.get('causalEffect').value
      });

    this.camService.onCamChanged.subscribe((cam) => {
      this.cam = cam
    });
  }

  evidenceDisplayFn(evidence): string | undefined {
    return evidence ? evidence.label : undefined;
  }

  save() {
    const self = this;

    self.noctuaAnnotonConnectorService.connectorFormToAnnoton();
    self.noctuaGraphService.saveConnection(self.cam,
      this.noctuaAnnotonConnectorService.annoton,
      this.noctuaAnnotonConnectorService.subjectMFNode,
      this.noctuaAnnotonConnectorService.objectMFNode).then(function (data) {
        // self.noctuaFormGridService.clearForm();
        // self.dialogService.openSuccessfulSaveToast();
      });
  }

  addEvidence() {
    const self = this;

    let evidenceFormGroup: FormArray = <FormArray>self.connectorFormGroup.get('evidenceFormArray');

    evidenceFormGroup.push(this.formBuilder.group({
      evidence: new FormControl(),
      reference: new FormControl(),
      with: new FormControl(),
    }));

  }

  removeEvidence(index) {
    const self = this;

    let evidenceFormGroup: FormArray = <FormArray>self.connectorFormGroup.get('evidenceFormArray');

    evidenceFormGroup.removeAt(index);
  }

  clear() {
    this.noctuaFormGridService.clearForm();
  }

  close() {
    this._matDialogRef.close();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}

