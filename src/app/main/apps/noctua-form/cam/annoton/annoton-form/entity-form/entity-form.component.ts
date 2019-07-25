import { Component, Input, Inject, OnInit, ElementRef, OnDestroy, ViewEncapsulation, ViewChild, NgZone } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, take } from 'rxjs/operators';


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
  Evidence,
  noctuaFormConfig,
  Entity
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
    private ngZone: NgZone,
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

    self.entity.addEvidence();
    self.noctuaAnnotonFormService.initializeForm();
  }

  removeEvidence(index: number) {
    const self = this;

    self.entity.removeEvidence(index);
    self.noctuaAnnotonFormService.initializeForm();
  }

  toggleIsComplement(entity: AnnotonNode) {

  }

  openSearchDatabaseDialog(entity: AnnotonNode) {
    const self = this;
    let gpNode = this.noctuaAnnotonFormService.annotonForm.gp.value;

    if (gpNode) {
      let data = {
        readonly: false,
        gpNode: gpNode,
        aspect: entity.aspect,
        entity: entity,
        params: {
          term: '',
          evidence: ''
        }
      }

      let success = function (selected) {
        if (selected.term) {
          entity.setTerm(selected.term.getTerm());

          if (selected.evidences && selected.evidences.length > 0) {
            entity.setEvidence(selected.evidences);
          }
          self.noctuaAnnotonFormService.initializeForm();
        }
      }
      self.noctuaFormDialogService.openSearchDatabaseDialog(data, success)
    } else {
      let errors = [];
      let meta = {
        aspect: gpNode ? gpNode.label : 'Gene Product'
      }
      // let error = new AnnotonError('error', 1, "Please enter a gene product", meta)
      //errors.push(error);
      // self.dialogService.openAnnotonErrorsDialog(ev, entity, errors)
    }
  }

  openMoreEvidenceDialog() {

  }

  addNDEvidence() {
    const self = this;

    let evidence = new Evidence();
    evidence.setEvidence(new Entity(
      noctuaFormConfig.evidenceAutoPopulate.nd.evidence.id,
      noctuaFormConfig.evidenceAutoPopulate.nd.evidence.label));
    evidence.setReference(new Entity(null, noctuaFormConfig.evidenceAutoPopulate.nd.reference));
    self.entity.setEvidence([evidence]);
    self.noctuaAnnotonFormService.initializeForm();
  }

  addRootTerm() {
    const self = this;

    let term = _.find(noctuaFormConfig.rootNode, (rootNode) => {
      return rootNode.aspect === self.entity.aspect
    });

    if (term) {
      self.entity.setTerm(new Entity(term.id, term.label));
      self.noctuaAnnotonFormService.initializeForm();
    }
  }

  clearValues() {
    const self = this;

    self.entity.clearValues();
    self.noctuaAnnotonFormService.initializeForm();
  }

  openSelectEvidenceDialog() {
    const self = this;

    let evidences: Evidence[] = this.camService.getUniqueEvidence();

    let success = function (selected) {
      if (selected.evidences && selected.evidences.length > 0) {
        self.entity.setEvidence(selected.evidences, ['assignedBy']);
        self.noctuaAnnotonFormService.initializeForm();
      }
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
