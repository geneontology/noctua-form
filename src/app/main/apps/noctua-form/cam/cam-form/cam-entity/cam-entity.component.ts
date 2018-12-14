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

import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

@Component({
  selector: 'noc-cam-entity',
  templateUrl: './cam-entity.component.html',
  styleUrls: ['./cam-entity.component.scss'],
})

export class CamFormEntityComponent implements OnInit, OnDestroy {
  searchCriteria: any = {};
  camForm: FormGroup;
  camFormPresentation: any;
  evidenceFormArray: FormArray;
  autcompleteResults = {
    term: [],
    evidence: []
  };
  cams: any[] = [];

  nodeGroup: any = {}
  entity: any = {}

  @Input('entityFormGroup')
  public entityFormGroup: FormGroup;

  @Input('nodeGroupName')
  public nodeGroupName: any;

  @Input('entityName')
  public entityName: any;

  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
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
    this.entityFormGroup = this.createEntityGroup();
    console.log("FD Form Group", this.entityFormGroup);
    console.log("entityName", this.entityName, this.nodeGroupName);

    this.nodeGroup = this.camFormPresentation['fd'][this.nodeGroupName];
    this.entity = _.find(this.nodeGroup.nodes, { id: this.entityName });

    console.log("entity", this.entity, this.nodeGroup);
    this.onValueChanges();
  }

  search() {
    let searchCriteria = this.camForm.value;

    this.noctuaSearchService.search(searchCriteria);
  }

  createEntityGroup() {
    return new FormGroup({
      term: new FormControl(),
      evidence: new FormControl(),
      reference: new FormControl(),
      with: new FormControl(),
    });
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

    this.entityFormGroup.get('evidence').valueChanges
      .distinctUntilChanged()
      .debounceTime(400)
      .subscribe(data => {
        this.noctuaLookupService.golrLookup(data, this.entity.evidence[0].evidence.lookup.requestParams).subscribe(response => {
          self.autcompleteResults.evidence = response;
        });
      });
  }

  close() {
    this.noctuaFormService.closeLeftDrawer();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
