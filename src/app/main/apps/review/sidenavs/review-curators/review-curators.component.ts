import { Component, Inject, OnInit, ElementRef, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
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

import { ReviewService } from '../../services/review.service';

import { NoctuaTranslationLoaderService } from '@noctua/services/translation-loader.service';
import { NoctuaFormConfigService } from '@noctua.form/services/config/noctua-form-config.service';
import { NoctuaLookupService } from '@noctua.form/services/lookup.service';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';

import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

@Component({
  selector: 'noc-review-curators',
  templateUrl: './review-curators.component.html',
  styleUrls: ['./review-curators.component.scss'],
})

export class ReviewCuratorsComponent implements OnInit, OnDestroy {
  searchCriteria: any = {};
  searchForm: FormGroup;
  groupsForm: FormGroup;
  searchFormData: any = []
  groups: any[] = [];
  curators: any[] = [];

  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    private noctuaSearchService: NoctuaSearchService,
    private formBuilder: FormBuilder,
    private noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaLookupService: NoctuaLookupService,
    private reviewService: ReviewService,
    private sparqlService: SparqlService,
    private noctuaTranslationLoader: NoctuaTranslationLoaderService) {
    this.curators = this.reviewService.curators;

    this.unsubscribeAll = new Subject();

    this.groupsForm = this.formBuilder.group({
      groups: []
    })
  }

  ngOnInit(): void {
    this.reviewService.onCuratorsChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(curators => {
        this.curators = curators;
        let grouped = this.reviewService.groupCurators();
        console.log('-----', grouped)
      });

    this.reviewService.onGroupsChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(groups => {
        this.groups = groups;
        console.log('-++----', groups)
      });

    //this.searchForm = this.createSearchForm();
  }

  search() {
    let searchCriteria = this.searchForm.value;

    console.dir(searchCriteria)
    this.noctuaSearchService.search(searchCriteria);
  }

  close() {
    this.reviewService.closeLeftDrawer();
  }

  createSearchForm() {
    return new FormGroup({
      term: new FormControl(),
      groups: this.groupsForm,
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
