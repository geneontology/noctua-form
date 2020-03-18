import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, Subject, Subscription } from 'rxjs';

import { noctuaAnimations } from '@noctua/animations';

import { takeUntil } from 'rxjs/internal/operators';


import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';
import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

import {
  NoctuaFormConfigService,
  CamService
} from 'noctua-form-base';

import { Cam, CamPage } from 'noctua-form-base';
import { SearchService } from 'app/main/apps/noctua-search/services/search.service';
import { MatPaginator } from '@angular/material';

@Component({
  selector: 'noc-cams-table',
  templateUrl: './cams-table.component.html',
  styleUrls: ['./cams-table.component.scss'],
  animations: noctuaAnimations
})
export class CamsTableComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

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
  camPage: CamPage;

  constructor(
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaSearchService: NoctuaSearchService,
    public searchService: SearchService,
    public sparqlService: SparqlService) {

    this._unsubscribeAll = new Subject();
    this.searchFormData = this.noctuaFormConfigService.createSearchFormData();

  }

  ngOnInit(): void {

    console.log('pp')

    this.noctuaSearchService.onCamsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(cams => {
        if (!cams) {
          return;
        }
        this.cams = cams;
      });

    this.noctuaSearchService.onCamsPageChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((camPage: CamPage) => {
        if (!camPage) {
          return;
        }
        this.camPage = camPage;
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

