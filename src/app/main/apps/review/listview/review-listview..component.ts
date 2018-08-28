import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { noctuaAnimations } from '@noctua/animations';
import { NoctuaUtils } from '@noctua/utils/noctua-utils';

import { takeUntil } from 'rxjs/internal/operators';
import { forEach } from '@angular/router/src/utils/collection';

import { NoctuaTranslationLoaderService } from '@noctua/services/translation-loader.service';
import { NoctuaFormConfigService } from '@noctua.form/services/config/noctua-form-config.service';
import { NoctuaGraphService } from '@noctua.form/services/graph.service';
import { SummaryGridService } from '@noctua.form/services/summary-grid.service';

import { locale as english } from './../i18n/en';

import { ReviewDialogService } from './../dialog.service';

import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

@Component({
  selector: 'app-review-listview',
  templateUrl: './review-listview.component.html',
  styleUrls: ['./review-listview.component.scss'],
  animations: noctuaAnimations
})
export class ReviewListviewComponent implements OnInit, OnDestroy {
  dataSource: CamsDataSource | null;
  displayedColumns = [
    'expand',
    'model',
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
  searchForm: FormGroup;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild('filter')
  filter: ElementRef;

  @ViewChild(MatSort)
  sort: MatSort;
  cams: any[] = [];

  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    private noctuaFormConfigService: NoctuaFormConfigService,
    private reviewDialogService: ReviewDialogService,
    private noctuaGraphService: NoctuaGraphService,
    private summaryGridService: SummaryGridService,
    private sparqlService: SparqlService,
    private noctuaTranslationLoader: NoctuaTranslationLoaderService) {
    this.noctuaTranslationLoader.loadTranslations(english);
    this.searchForm = this.createAnswerForm();

    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    this.sparqlService.getCamsGoTerms('GO:0099160').subscribe((response: any) => {
      this.cams = this.sparqlService.cams = response;
      this.sparqlService.onCamsChanged.next(this.cams);
      this.loadCams();
    });

    this.sparqlService.onCamsChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(cams => {
        this.cams = cams;
        this.loadCams();
      });
    /*
        fromEvent(this.filter.nativeElement, 'keyup')
          .pipe(
            takeUntil(this.unsubscribeAll),
            debounceTime(150),
            distinctUntilChanged()
          )
          .subscribe(() => {
            if (!this.dataSource) {
              return;
            }
            this.dataSource.filter = this.filter.nativeElement.value;
          });
          */
  }

  createAnswerForm() {
    return new FormGroup({
      goTerm: new FormControl(this.searchCriteria.goTerm),
      geneProduct: new FormControl(this.searchCriteria.geneProduct),
      pmid: new FormControl(this.searchCriteria.pmid),
    });
  }

  loadCams() {
    this.cams = this.sparqlService.cams;
    this.dataSource = new CamsDataSource(this.sparqlService, this.paginator, this.sort);
  }

  toggleExpand(cam) {
    cam.expanded = true;
    cam.graph = this.noctuaGraphService.getGraphInfo(cam.model.id)
    cam.graph.onGraphChanged.subscribe((annotons) => {
      let data = this.summaryGridService.getGrid(cam.graph.annotons);
      this.sparqlService.addCamChildren(cam, data);
      this.dataSource = new CamsDataSource(this.sparqlService, this.paginator, this.sort);
    });
  }

  openCamEdit(cam) {
    this.reviewDialogService.openCamRowEdit(cam);
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
