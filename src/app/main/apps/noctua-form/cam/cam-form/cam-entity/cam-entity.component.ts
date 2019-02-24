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

import { noctuaAnimations } from '@noctua/animations';
import { NoctuaUtils } from '@noctua/utils/noctua-utils';

import { takeUntil } from 'rxjs/internal/operators';
import { forEach } from '@angular/router/src/utils/collection';

import { NoctuaFormService } from '../../../services/noctua-form.service';

import { NoctuaTranslationLoaderService } from '@noctua/services/translation-loader.service';
import { NoctuaFormGridService } from '@noctua.form/services/form-grid.service';
import { NoctuaFormConfigService } from '@noctua.form/services/config/noctua-form-config.service';
import { NoctuaLookupService } from '@noctua.form/services/lookup.service';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';
import { NoctuaFormDialogService } from './../../../dialog.service';

import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

import { AnnotonNode } from '@noctua.form/models/annoton/annoton-node';
import { Evidence } from '@noctua.form/models/annoton/evidence';

@Component({
  selector: 'noc-cam-entity',
  templateUrl: './cam-entity.component.html',
  styleUrls: ['./cam-entity.component.scss'],
})

export class CamFormEntityComponent implements OnInit, OnDestroy {
  searchCriteria: any = {};
  // camForm: FormGroup;
  camFormPresentation: any;
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
    private noctuaSearchService: NoctuaSearchService,
    private noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaFormGridService: NoctuaFormGridService,
    private noctuaLookupService: NoctuaLookupService,
    private noctuaFormService: NoctuaFormService,
    private sparqlService: SparqlService, ) {
    this.unsubscribeAll = new Subject();

    this.camFormPresentation = this.noctuaFormGridService.annotonPresentation;

  }

  ngOnInit(): void {

    this.nodeGroup = this.camFormPresentation['fd'][this.nodeGroupName];
    this.entity = <AnnotonNode>_.find(this.nodeGroup.nodes, { id: this.entityName });
    // this.entityFormGroup = this.createEntityGroup();


  }

  createEntityGroup() {
    return new FormGroup({
      term: new FormControl(this.entity.getTerm()),
      evidenceFormArray: this.formBuilder.array(this.createFormEvidence())
    });
  }

  createFormEvidence(): FormGroup[] {
    const self = this;
    let evidenceGroup: FormGroup[] = [];

    _.each(self.entity.evidence, function (evidence: Evidence) {
      let srcEvidence: FormGroup = new FormGroup({
        evidence: new FormControl(evidence.getEvidence()),
        reference: new FormControl(evidence.getReference()),
        with: new FormControl(evidence.getWith()),
      })
      evidenceGroup.push(srcEvidence);

      self.addOnEvidenceValueChanges(srcEvidence)
    });

    return evidenceGroup;
  }


  addOnEvidenceValueChanges(evidence) {
    const self = this;

    evidence.get('evidence').valueChanges
      .distinctUntilChanged()
      .debounceTime(400)
      .subscribe(data => {
        this.noctuaLookupService.golrLookup(data, evidence.lookup.requestParams).subscribe(response => {
          self.autcompleteResults.evidence = response;
        });
      });
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

  onValueChanges() {
    const self = this;

    this.entityFormGroup.get('term').valueChanges
      .distinctUntilChanged()
      .debounceTime(400)
      .subscribe(data => {
        this.noctuaLookupService.golrLookup(data, this.entity.term.lookup.requestParams).subscribe(response => {
          self.autcompleteResults.term = response;
        });
      });
  }

  openSelectEvidenceDialog(evidence) {
    const self = this;

    /*

    let evidences = Util.addUniqueEvidencesFromAnnoton(self.formGrid.annoton);
    Util.getUniqueEvidences(self.summaryData.annotons, evidences);

    let gpNode = self.formGrid.annotonPresentation.geneProduct;

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

    self.noctuaFormDialogService.openSelectEvidenceDialog(evidence);
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
