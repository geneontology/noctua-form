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
  selector: 'noc-review-search',
  templateUrl: './review-search.component.html',
  styleUrls: ['./review-search.component.scss'],
})

export class ReviewSearchComponent implements OnInit, OnDestroy {
  searchCriteria: any = {};
  searchForm: FormGroup;
  searchFormData: any = []
  cams: any[] = [];

  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    private noctuaSearchService: NoctuaSearchService,
    private noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaLookupService: NoctuaLookupService,
    private reviewService: ReviewService,
    private sparqlService: SparqlService,
    private noctuaTranslationLoader: NoctuaTranslationLoaderService) {
    this.searchForm = this.createAnswerForm();

    this.unsubscribeAll = new Subject();

    this.searchFormData = this.noctuaFormConfigService.createReviewSearchFormData();
    this.onValueChanges();
  }

  ngOnInit(): void {

    this.sparqlService.getAllCurators().subscribe((response: any) => {
      this.searchFormData['curator'].searchResults = response;
    });

    this.sparqlService.getAllGroups().subscribe((response: any) => {
      this.searchFormData['providedBy'].searchResults = response;
    });

  }

  search() {
    let searchCriteria = this.searchForm.value;

    console.dir(searchCriteria)
    this.noctuaSearchService.search(searchCriteria);
  }

  createAnswerForm() {
    return new FormGroup({
      gp: new FormControl(this.searchCriteria.gp),
      goTerm: new FormControl(this.searchCriteria.goTerm),
      pmid: new FormControl(this.searchCriteria.pmid),
      curator: new FormControl(this.searchCriteria.curator),
      providedBy: new FormControl(this.searchCriteria.providedBy),
      species: new FormControl(this.searchCriteria.species),
    });
  }

  onValueChanges() {
    const self = this;

    this.searchForm.get('goTerm').valueChanges
      .distinctUntilChanged()
      .debounceTime(400)
      .subscribe(data => {
        let searchData = self.searchFormData['goTerm'];
        this.noctuaLookupService.golrTermLookup(data, searchData.id).subscribe(response => {
          self.searchFormData['goTerm'].searchResults = response
        });
      });

    this.searchForm.get('gp').valueChanges
      .distinctUntilChanged()
      .debounceTime(400)
      .subscribe(data => {
        let searchData = self.searchFormData['gp'];
        this.noctuaLookupService.golrTermLookup(data, searchData.id).subscribe(response => {
          self.searchFormData['gp'].searchResults = response
        })
      })

    self.searchFormData['curator'].filteredResult = this.searchForm.get('curator').valueChanges
      .distinctUntilChanged()
      .debounceTime(400)
      .pipe(
        //    startWith(''),
        //  map(value => this._filter(value))
      )
  }

  close() {
    this.reviewService.closeLeftDrawer();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
