import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatDrawer } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { noctuaAnimations } from './../../../../../../../@noctua/animations';

import { takeUntil, startWith } from 'rxjs/internal/operators';

import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import { forEach } from '@angular/router/src/utils/collection';


import { NoctuaFormService } from './../../../services/noctua-form.service';
import { CamTableService } from './../services/cam-table.service';
import { NoctuaFormDialogService } from './../../../services/dialog.service';
import { NoctuaSearchService } from './../../../../../../../@noctua.search/services/noctua-search.service';

import {
  NoctuaAnnotonConnectorService,
  NoctuaGraphService,
  NoctuaFormConfigService,
  NoctuaAnnotonFormService,
  NoctuaLookupService,
  NoctuaAnnotonEntityService,
  CamService
} from 'noctua-form-base';

import {
  Cam,
  Annoton,
  AnnotonNode
} from 'noctua-form-base';

import { SparqlService } from './../../../../../../../@noctua.sparql/services/sparql/sparql.service';

@Component({
  selector: 'noc-annoton-table',
  templateUrl: './annoton-table.component.html',
  styleUrls: ['./annoton-table.component.scss'],
  animations: noctuaAnimations
})
export class AnnotonTableComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'relationship',
    'aspect',
    'term',
    'relationshipExt',
    'extension',
    'evidence',
    'reference',
    'with',
    'assignedBy'];

  grid: any[] = [];

  @Input('cam')
  public cam: Cam

  @Input('annoton')
  public annoton: Annoton

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild('filter')
  filter: ElementRef;

  @ViewChild(MatSort)
  sort: MatSort;

  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    private camService: CamService,
    public noctuaFormService: NoctuaFormService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaSearchService: NoctuaSearchService,
    //  public noctuaFormService: NoctuaFormService,
    public camTableService: CamTableService,
    private noctuaFormDialogService: NoctuaFormDialogService,
    private noctuaLookupService: NoctuaLookupService,
    private noctuaGraphService: NoctuaGraphService,
    public noctuaAnnotonEntityService: NoctuaAnnotonEntityService,
    private sparqlService: SparqlService) {

    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.loadCam();
  }

  loadCam() {
    this.grid = this.annoton.grid;
  }

  selectEntity(entity: AnnotonNode) {
    this.noctuaAnnotonEntityService.initializeForm(this.annoton, entity);
    this.noctuaFormService.openRightDrawer(this.noctuaFormService.panel.annotonEntityForm);

    console.log(this.noctuaAnnotonEntityService.termNode.id === entity.id)
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}

