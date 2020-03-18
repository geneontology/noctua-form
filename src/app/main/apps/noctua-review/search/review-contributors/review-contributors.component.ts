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


import { ReviewService } from '../../services/review.service';


import {
  NoctuaFormConfigService,
  NoctuaUserService
} from 'noctua-form-base';
import { NoctuaLookupService } from 'noctua-form-base';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';
import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

@Component({
  selector: 'noc-review-contributors',
  templateUrl: './review-contributors.component.html',
  styleUrls: ['./review-contributors.component.scss'],
})

export class ReviewContributorsComponent implements OnInit, OnDestroy {
  searchCriteria: any = {};
  searchForm: FormGroup;
  groupsForm: FormGroup;
  searchFormData: any = []
  // groups: any[] = [];
  // contributors: any[] = [];

  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    public noctuaUserService: NoctuaUserService,
    private noctuaSearchService: NoctuaSearchService,
    private formBuilder: FormBuilder,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaLookupService: NoctuaLookupService,
    private reviewService: ReviewService,
    private sparqlService: SparqlService,
  ) {
    // this.contributors = this.reviewService.contributors;
    this.searchFormData = this.noctuaFormConfigService.createSearchFormData();
    this.unsubscribeAll = new Subject();

    this.groupsForm = this.formBuilder.group({
      groups: []
    })
  }

  ngOnInit(): void {


    //this.searchForm = this.createSearchForm();
  }

  selectContributor(contributor) {
    this.searchCriteria.contributor = contributor;
    this.noctuaSearchService.search(this.searchCriteria)
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
