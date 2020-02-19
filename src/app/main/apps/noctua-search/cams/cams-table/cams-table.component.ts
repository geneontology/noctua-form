import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatDrawer } from '@angular/material';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { merge, Observable, BehaviorSubject, fromEvent, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { noctuaAnimations } from '@noctua/animations';

import { takeUntil, startWith } from 'rxjs/internal/operators';


import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';
import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

import {
  NoctuaGraphService,
  NoctuaFormConfigService,
  NoctuaLookupService,
  CamService,
  noctuaFormConfig
} from 'noctua-form-base';

import {
  Cam,
  Annoton,
  AnnotonNode
} from 'noctua-form-base';
import { NoctuaFormService } from './../../../noctua-form/services/noctua-form.service';
import { SearchService } from 'app/main/apps/noctua-search/services/search.service';

@Component({
  selector: 'noc-cams-table',
  templateUrl: './cams-table.component.html',
  styleUrls: ['./cams-table.component.scss'],
  animations: noctuaAnimations
})
export class CamsTableComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;

  displayedColumns = [
    'title',
    'state',
    'date',
    'contributor',
    'edit',
    'export'];

  searchCriteria: any = {};
  searchFormData: any = [];
  searchForm: FormGroup;
  loadingSpinner: any = {
    color: 'primary',
    mode: 'indeterminate'
  };

  cams: any[] = [];
  searchResults = [];
  dataSource: CamsDataSource;

  constructor(
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaSearchService: NoctuaSearchService,
    public searchService: SearchService,
    private camService: CamService,
    public sparqlService: SparqlService) {

    this._unsubscribeAll = new Subject();

    this.searchFormData = this.noctuaFormConfigService.createSearchFormData();

    this.dataSource = new CamsDataSource(camService);
  }

  ngOnInit(): void {

    this.noctuaSearchService.onCamsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(cams => {
        this.cams = cams;
        console.log(cams)
      });
  }

  toggleLeftDrawer(panel) {
    this.searchService.toggleLeftDrawer(panel);
  }

  search() {
    const searchCriteria = this.searchForm.value;
    console.dir(searchCriteria);
    this.noctuaSearchService.search(searchCriteria);
  }



  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}


export class CamsDataSource extends DataSource<Cam | undefined> {
  private cachedCams = Array.from<Cam>({ length: 0 });
  private dataStream = new BehaviorSubject<(Cam | undefined)[]>(this.cachedCams);
  private subscription = new Subscription();

  constructor(private camService: CamService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<(Cam | undefined)[] | ReadonlyArray<Cam | undefined>> {
    this.subscription.add(collectionViewer.viewChange.subscribe(range => {
      // const currentPage = this._getPageForIndex(range.end);

      //  if (currentPage > this.lastPage) {
      //    this.lastPage = currentPage;
      //    this._fetchFactPage();
      // }
    }));
    return this.dataStream;
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.subscription.unsubscribe();
  }
}
