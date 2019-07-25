import { Component, Inject, Input, OnInit, ElementRef, OnDestroy, ViewEncapsulation, ViewChild, NgZone } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatDrawer } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, Subscription, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, take, distinctUntilChanged, map } from 'rxjs/operators';


import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

import { noctuaAnimations } from './../../../../../../../@noctua/animations';


import { NoctuaFormService } from '../../../services/noctua-form.service';

import { NoctuaSearchService } from './../../../../../../../@noctua.search/services/noctua-search.service';
import { CamDiagramService } from './../../cam-diagram/services/cam-diagram.service';
import { CamTableService } from './../../cam-table/services/cam-table.service';

import { SparqlService } from './../../../../../../../@noctua.sparql/services/sparql/sparql.service';

import {
  NoctuaGraphService,
  NoctuaFormConfigService,
  NoctuaAnnotonFormService,
  NoctuaLookupService,
  NoctuaAnnotonEntityService,
  CamService,
  NoctuaTripleFormService,
  Triple
} from 'noctua-form-base';

import { Cam } from 'noctua-form-base';
import { Annoton } from 'noctua-form-base';
import { AnnotonNode } from 'noctua-form-base';
import { Evidence } from 'noctua-form-base';
import { NoctuaFormDialogService } from '../../../services/dialog.service';


@Component({
  selector: 'noc-triple-form',
  templateUrl: './triple-form.component.html',
  styleUrls: ['./triple-form.component.scss'],
})

export class TripleFormComponent implements OnInit, OnDestroy {

  @Input('panelDrawer')
  panelDrawer: MatDrawer;

  cam: Cam;
  tripleFormGroup: FormGroup;
  tripleFormSub: Subscription;
  evidenceFormArray: FormArray;
  triple: Triple;

  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    private ngZone: NgZone,
    private camService: CamService,
    private formBuilder: FormBuilder,
    private noctuaTripleFormService: NoctuaTripleFormService,
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
  }

  ngOnInit(): void {
    this.tripleFormSub = this.noctuaTripleFormService.tripleFormGroup$
      .subscribe(tripleFormGroup => {
        if (!tripleFormGroup) return;
        this.tripleFormGroup = tripleFormGroup;
        this.triple = this.noctuaTripleFormService.triple;
      });

    this.camService.onCamChanged.subscribe((cam) => {
      if (!cam) return;

      this.cam = cam
    });
  }

  termDisplayFn(evidence): string | undefined {
    return evidence ? evidence.label : undefined;
  }

  evidenceDisplayFn(evidence): string | undefined {
    return evidence ? evidence.label : undefined;
  }

  checkErrors() {
    //  this.noctuaTripleFormService.annoton.enableSubmit();

    let errors = this.noctuaAnnotonFormService.annoton.submitErrors;
    this.noctuaFormDialogService.openAnnotonErrorsDialog(errors)
  }

  save() {
    const self = this;
    self.noctuaTripleFormService.tripleFormToAnnoton();

    //  this.noctuaGraphService.edit(this.camService.cam, self.noctuaTripleFormService.termNode).then((data) => {
    //  localStorage.setItem('barista_token', value);  
    //  self.noctuaFormDialogService.openSuccessfulSaveToast('Activity successfully edited.', 'OK');
    //  });
  }

  openMoreEvidenceDialog() {

  }

  openSelectEvidenceDialog(evidence: Evidence) {

  }

  addNDEvidence(evidence: Evidence) {

  }
  addEvidence() {
    const self = this;

    let evidenceFormGroup: FormArray = <FormArray>self.tripleFormGroup.get('evidenceFormArray');

    evidenceFormGroup.push(this.formBuilder.group({
      evidence: new FormControl(),
      reference: new FormControl(),
      with: new FormControl(),
    }));
  }

  removeEvidence(index) {
    const self = this;

    let evidenceFormGroup: FormArray = <FormArray>self.tripleFormGroup.get('evidenceFormArray');

    evidenceFormGroup.removeAt(index);
  }

  clear() {
    this.noctuaAnnotonFormService.clearForm();
  }



  close() {
    this.panelDrawer.close()
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
