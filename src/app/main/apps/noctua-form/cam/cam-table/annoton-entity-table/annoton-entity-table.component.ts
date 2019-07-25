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
  selector: 'noc-annoton-entity-table',
  templateUrl: './annoton-entity-table.component.html',
  styleUrls: ['./annoton-entity-table.component.scss'],
  animations: noctuaAnimations
})
export class AnnotonEntityTableComponent implements OnInit, OnDestroy {
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

  // @Input('annotonNodes')
  //  public annotonNodes: AnnotonNode[]

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
    this.cam.onGraphChanged.subscribe((annotons: Annoton[]) => {
      if (annotons) {
        this.cam.applyFilter();
        this.loadCam();
      }
    });
  }

  loadCam() {
    this.grid = this.cam.grid;
  }

  selectEntity(annoton: Annoton, entity: AnnotonNode) {
    this.camService.onCamChanged.next(this.cam);

    this.noctuaAnnotonEntityService.initializeForm(annoton, entity);
    this.noctuaFormService.openRightDrawer(this.noctuaFormService.panel.annotonEntityForm);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}

