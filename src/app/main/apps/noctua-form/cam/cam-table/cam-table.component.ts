
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

import { NoctuaTranslationLoaderService } from '@noctua/services/translation-loader.service';
import { NoctuaFormConfigService } from '@noctua.form/services/config/noctua-form-config.service';
import { NoctuaGraphService } from '@noctua.form/services/graph.service';
import { NoctuaLookupService } from '@noctua.form/services/lookup.service';
import { SummaryGridService } from '@noctua.form/services/summary-grid.service';


import { NoctuaFormService } from './../../services/noctua-form.service';
import { NoctuaFormDialogService } from './../../dialog.service';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';
import { CamService } from '@noctua.form/services/cam.service'

import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

import { Cam } from '@noctua.form/models/annoton/cam';


@Component({
  selector: 'noc-cam-table',
  templateUrl: './cam-table.component.html',
  styleUrls: ['./cam-table.component.scss'],
  animations: noctuaAnimations
})
export class CamTableComponent implements OnInit, OnDestroy {
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

  @Input('cam')
  public cam: Cam

  @ViewChild('leftDrawer')
  leftDrawer: MatDrawer;

  @ViewChild('rightDrawer')
  rightDrawer: MatDrawer;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild('filter')
  filter: ElementRef;

  @ViewChild(MatSort)
  sort: MatSort;

  searchResults = [];
  modelId: string = '';

  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    private camService: CamService,
    private noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaSearchService: NoctuaSearchService,
    public noctuaFormService: NoctuaFormService,
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
    this.noctuaFormService.setLeftDrawer(this.leftDrawer);
    this.noctuaFormService.setRightDrawer(this.rightDrawer);
  }

  toggleLeftDrawer(panel) {
    this.noctuaFormService.toggleLeftDrawer(panel);
  }

  search() {
    let searchCriteria = this.searchForm.value;
    console.dir(searchCriteria)
    this.noctuaSearchService.search(searchCriteria);
  }

  loadCam() {
    this.cam.onGraphChanged.subscribe((annotons) => {
      if (annotons) {
        let data = this.summaryGridService.getGrid(annotons);

        this.camService.addCamChildren(this.cam, data);
        console.log('poo', this.cam)
        this.dataSource = new CamsDataSource(this.sparqlService, this.paginator, this.sort);
      }
    });
  }

  toggleExpand(cam) {
    cam.expanded = true;
    this.noctuaGraphService.getGraphInfo(cam, cam.model.id)
    cam.onGraphChanged.subscribe((annotons) => {
      let data = this.summaryGridService.getGrid(annotons);
      this.sparqlService.addCamChildren(cam, data);
      //  this.dataSource = new CamsDataSource(this.sparqlService, this.paginator, this.sort);
    });
  }

  openCamEdit(cam) {
    this.noctuaFormDialogService.openCamRowEdit(cam);
  }

  selectCam(cam) {
    this.sparqlService.onCamChanged.next(cam);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete(); ``
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

