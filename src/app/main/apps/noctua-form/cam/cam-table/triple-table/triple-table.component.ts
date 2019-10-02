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
  NoctuaTripleFormService,
  CamService
} from 'noctua-form-base';

import {
  Cam,
  Annoton,
  AnnotonNode
} from 'noctua-form-base';

import { SparqlService } from './../../../../../../../@noctua.sparql/services/sparql/sparql.service';

@Component({
  selector: 'noc-triple-table',
  templateUrl: './triple-table.component.html',
  styleUrls: ['./triple-table.component.scss'],
  animations: noctuaAnimations
})
export class TripleTableComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'subject',
    'aspectS',
    'relationship',
    'object',
    'aspectO',
    'evidence',
    'reference',
    'with',
    'assignedBy'];

  grid: any[] = [];

  @Input('cam')
  public cam: Cam

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
    public noctuaTripleFormService: NoctuaTripleFormService,
    private sparqlService: SparqlService) {

    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.loadCam();
  }

  loadCam() {
    this.grid = this.cam.generateTripleGrid();
    console.log(this.grid);
  }

  selectTriple(triple) {
    console.log(this.grid);
    this.camService.onCamChanged.next(this.cam);

    this.noctuaTripleFormService.initializeForm(triple);
    this.noctuaFormService.openRightDrawer(this.noctuaFormService.panel.tripleForm);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}

