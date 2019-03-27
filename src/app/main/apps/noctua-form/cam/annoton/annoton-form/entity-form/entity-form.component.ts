import { Component, Input, Inject, OnInit, ElementRef, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';


import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

import { noctuaAnimations } from './../../../../../../../../@noctua/animations';


import { NoctuaFormService } from '../../../../services/noctua-form.service';

import { NoctuaTranslationLoaderService } from './../../../../../../../../@noctua/services/translation-loader.service';

import { NoctuaSearchService } from './../../../../../../../../@noctua.search/services/noctua-search.service';
import { NoctuaFormDialogService } from './../../../../services/dialog.service';

import { SparqlService } from './../../../../../../../../@noctua.sparql/services/sparql/sparql.service';

import {
  CamService,
  NoctuaFormConfigService,
  NoctuaAnnotonFormService,
  NoctuaLookupService,
  AnnotonNode,
  Evidence
} from 'noctua-form-base';

@Component({
  selector: 'noc-entity-form',
  templateUrl: './entity-form.component.html',
  styleUrls: ['./entity-form.component.scss'],
})

export class EntityFormComponent implements OnInit, OnDestroy {
  searchCriteria: any = {};
  // annotonForm: FormGroup;
  annotonFormPresentation: any;
  evidenceFormArray: FormArray;
  autcompleteResults = {
    term: [],
    evidence: []
  };
  cams: any[] = [];

  nodeGroup: any = {}
  entity: AnnotonNode;

  @Input('entityFormGroup')
  public entityFormGroup: FormGroup;

  @Input('nodeGroupName')
  public nodeGroupName: any;

  @Input('entityName')
  public entityName: any;

  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private noctuaFormDialogService: NoctuaFormDialogService,
    private camService: CamService,
    private noctuaSearchService: NoctuaSearchService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaAnnotonFormService: NoctuaAnnotonFormService,
    private noctuaLookupService: NoctuaLookupService,
    private noctuaFormService: NoctuaFormService,
    private sparqlService: SparqlService, ) {
    this.unsubscribeAll = new Subject();

  }

  ngOnInit(): void {

    this.nodeGroup = this.noctuaAnnotonFormService.annoton.presentation['fd'][this.nodeGroupName];
    this.entity = <AnnotonNode>_.find(this.nodeGroup.nodes, { id: this.entityName });
    // this.entityFormGroup = this.createEntityGroup();


  }



  addEvidence() {
    const self = this;

    let evidenceFormGroup: FormArray = this.entityFormGroup.get('evidenceFormArray') as FormArray;

    evidenceFormGroup.push(this.formBuilder.group({
      evidence: new FormControl(),
      reference: new FormControl(),
      with: new FormControl(),
    }));
  }

  removeEvidence(index) {
    const self = this;

    let evidenceFormGroup: FormArray = <FormArray>self.entityFormGroup.get('evidenceFormArray');

    evidenceFormGroup.removeAt(index);
  }

  toggleIsComplement(entity: AnnotonNode) {

  }

  openSearchDatabaseDialog(entity: AnnotonNode) {

  }

  openMoreEvidenceDialog() {

  }


  addNDEvidence(srcEvidence: Evidence) {

  }

  openSelectEvidenceDialog(evidence) {
    const self = this;

    /*

    let evidences = Util.addUniqueEvidencesFromAnnoton(self.annotonForm.annoton);
    Util.getUniqueEvidences(self.summaryData.annotons, evidences);

    let gpNode = self.annotonForm.annotonPresentation.geneProduct;

    let data = {
      readonly: false,
      gpNode: gpNode,
      aspect: entity.aspect,
      node: entity,
      evidences: evidences,
      params: {
        term: entity.term.control.value.id,
      }
    }

    let success = function (selected) {
      entity.addEvidences(selected.evidences, ['assignedBy']);
    }
    */

    let evidences: Evidence[] = this.camService.getUniqueEvidence();
    let success = (evidence: Evidence[]) => {
      console.log(evidence)
    }

    self.noctuaFormDialogService.openSelectEvidenceDialog(evidences, success);
  }

  termDisplayFn(term): string | undefined {
    return term ? term.label : undefined;
  }

  evidenceDisplayFn(evidence): string | undefined {
    return evidence ? evidence.label : undefined;
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
