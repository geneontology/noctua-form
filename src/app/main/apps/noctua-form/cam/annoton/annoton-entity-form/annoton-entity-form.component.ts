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
  CamService
} from 'noctua-form-base';

import { Cam } from 'noctua-form-base';
import { Annoton } from 'noctua-form-base';
import { AnnotonNode } from 'noctua-form-base';
import { Evidence } from 'noctua-form-base';
import { NoctuaFormDialogService } from '../../../services/dialog.service';


@Component({
  selector: 'noc-annoton-entity-form',
  templateUrl: './annoton-entity-form.component.html',
  styleUrls: ['./annoton-entity-form.component.scss'],
})

export class AnnotonEntityFormComponent implements OnInit, OnDestroy {

  @Input('panelDrawer')
  panelDrawer: MatDrawer;

  annoton: Annoton;
  cam: Cam;
  annotonEntityFormGroup: FormGroup;
  annotonEntityFormSub: Subscription;
  evidenceFormArray: FormArray;
  termNode: AnnotonNode;

  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    private ngZone: NgZone,
    private camService: CamService,
    private formBuilder: FormBuilder,
    private noctuaAnnotonEntityService: NoctuaAnnotonEntityService,
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
    this.annotonEntityFormSub = this.noctuaAnnotonEntityService.annotonEntityFormGroup$
      .subscribe(annotonEntityFormGroup => {
        if (!annotonEntityFormGroup) return;
        this.annotonEntityFormGroup = annotonEntityFormGroup;
        this.annoton = this.noctuaAnnotonEntityService.annoton;
        this.termNode = this.noctuaAnnotonEntityService.termNode;

        console.log(this.termNode)
      });

    this.camService.onCamChanged.subscribe((cam) => {
      this.cam = cam
      this.cam.onGraphChanged.subscribe((annotons) => {
        //  let data = this.summaryGridService.getGrid(annotons);
        //  this.sparqlService.addCamChildren(cam, data);
        //  this.dataSource = new CamsDataSource(this.sparqlService, this.paginator, this.sort);
      });
    });
  }

  termDisplayFn(evidence): string | undefined {
    return evidence ? evidence.label : undefined;
  }

  evidenceDisplayFn(evidence): string | undefined {
    return evidence ? evidence.label : undefined;
  }

  checkErrors() {
    this.noctuaAnnotonEntityService.annoton.enableSubmit();

    let errors = this.noctuaAnnotonFormService.annoton.submitErrors;
    this.noctuaFormDialogService.openAnnotonErrorsDialog(errors)
  }

  save() {
    const self = this;
    self.noctuaAnnotonEntityService.annotonEntityFormToAnnoton();

    this.noctuaGraphService.edit(this.camService.cam, self.noctuaAnnotonEntityService.termNode);
  }

  /*   openSummary() {
      let destCam = this.camForm.value;
      this.cam.destNode.setTerm(destCam.term)
  
      let evidenceArray: Evidence[] = destCam.evidenceFormArray.map((evidence) => {
        let result = new Evidence()
  
        result.individualId = evidence.individualId;
        result.setEvidence(evidence.evidence);
        result.setReference(evidence.reference);
        result.setWith(evidence.with);
  
        return result;
      });
      this.cam.destNode.setEvidence(evidenceArray);
  
      this.reviewDialogService.openCamEditSummary(this.cam);
    } */
  openMoreEvidenceDialog() {

  }

  openSelectEvidenceDialog(evidence: Evidence) {

  }

  addNDEvidence(evidence: Evidence) {

  }
  addEvidence() {
    const self = this;

    let evidenceFormGroup: FormArray = <FormArray>self.annotonEntityFormGroup.get('evidenceFormArray');

    evidenceFormGroup.push(this.formBuilder.group({
      evidence: new FormControl(),
      reference: new FormControl(),
      with: new FormControl(),
    }));
  }

  removeEvidence(index) {
    const self = this;

    let evidenceFormGroup: FormArray = <FormArray>self.annotonEntityFormGroup.get('evidenceFormArray');

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
