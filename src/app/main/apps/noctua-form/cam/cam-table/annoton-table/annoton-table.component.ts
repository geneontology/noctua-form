import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatDrawer } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { noctuaAnimations } from '@noctua/animations';
import { NoctuaUtils } from '@noctua/utils/noctua-utils';

import { takeUntil, startWith } from 'rxjs/internal/operators';

import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import { forEach } from '@angular/router/src/utils/collection';

import { NoctuaFormConfigService } from '@noctua.form/services/config/noctua-form-config.service';
import { NoctuaGraphService } from '@noctua.form/services/graph.service';
import { NoctuaLookupService } from '@noctua.form/services/lookup.service';
import { SummaryGridService } from '@noctua.form/services/summary-grid.service';


import { NoctuaFormService } from './../../../services/noctua-form.service';
import { CamTableService } from './../services/cam-table.service';
import { NoctuaFormDialogService } from './../../../dialog.service';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';
import { CamService } from '@noctua.form/services/cam.service'

import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

import { Cam } from '@noctua.form/models/annoton/cam';
import { Annoton } from '@noctua.form/models/annoton/annoton';


@Component({
  selector: 'noc-annoton-table',
  templateUrl: './annoton-table.component.html',
  styleUrls: ['./annoton-table.component.scss'],
  animations: noctuaAnimations
})
export class AnnotonTableComponent implements OnInit, OnDestroy {
  dataSource: CamsDataSource | null;
  displayedColumns = [
    'expand',
    'annotatedEntity',
    'relationship',
    'aspect',
    'term',
    'relationshipExt',
    'extension',
    'evidence',
    'reference',
    'with',
    'assignedBy'];

  searchCriteria: any = {};
  searchFormData: any = []
  searchForm: FormGroup;
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
    private summaryGridService: SummaryGridService,
    private sparqlService: SparqlService, ) {

    this.searchFormData = this.noctuaFormConfigService.createReviewSearchFormData();
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.loadCam();
  }

  search() {
    let searchCriteria = this.searchForm.value;
    console.dir(searchCriteria)
    this.noctuaSearchService.search(searchCriteria);
  }

  loadCam() {
    this.grid = this.annoton.grid;

    console.log(this.annoton)
  }

  openCamEdit(cam) {
    this.noctuaFormDialogService.openCamRowEdit(cam);
  }

  selectCam(cam) {
    this.sparqlService.onCamChanged.next(cam);
    this.noctuaFormService.openRightDrawer(this.noctuaFormService.panel.camRow.id);
  }



  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}

export class CamsDataSource extends DataSource<any> {
  private filterChange = new BehaviorSubject('');
  private filteredDataChange = new BehaviorSubject('');

  constructor(
    private sparqlService: SparqlService,
    private matPaginator: MatPaginator,
    private matSort: MatSort
  ) {
    super();
    this.filteredData = this.sparqlService.cams;
  }

  get filteredData(): any {
    return this.filteredDataChange.value;
  }

  set filteredData(value: any) {
    this.filteredDataChange.next(value);
  }

  get filter(): string {
    return this.filterChange.value;
  }

  set filter(filter: string) {
    this.filterChange.next(filter);
  }

  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.sparqlService.onCamsChanged,
      this.matPaginator.page,
      this.filterChange,
      this.matSort.sortChange
    ];

    return merge(...displayDataChanges).pipe(map(() => {
      let data = this.sparqlService.cams.slice();
      data = this.filterData(data);
      this.filteredData = [...data];
      data = this.sortData(data);
      const startIndex = this.matPaginator.pageIndex * this.matPaginator.pageSize;
      return data.splice(startIndex, this.matPaginator.pageSize);
    })
    );
  }

  filterData(data): any {
    if (!this.filter) {
      return data;
    }
    return NoctuaUtils.filterArrayByString(data, this.filter);
  }

  sortData(data): any[] {
    if (!this.matSort.active || this.matSort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this.matSort.active) {
        case 'goname':
          [propertyA, propertyB] = [a.goname, b.goname];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.matSort.direction === 'asc' ? 1 : -1);
    });
  }

  disconnect(): void {
  }
}

