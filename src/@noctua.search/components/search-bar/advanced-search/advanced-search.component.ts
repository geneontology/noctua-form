import { Component, Inject, OnInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
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
import {
  NoctuaFormConfigService,
  NoctuaLookupService
} from 'noctua-form-base';
import { locale as english } from './i18n/en';

import { advancedSearchData } from './advanced-search.tokens';
import { AdvancedSearchOverlayRef } from './advanced-search-ref';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';


import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss']
})

export class NoctuaAdvancedSearchComponent implements OnInit, OnDestroy {
  searchCriteria: any = {};
  searchForm: FormGroup;
  searchFormData: any = []
  cams: any[] = [];

  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    public dialogRef: AdvancedSearchOverlayRef,
    @Inject(advancedSearchData) public data: any,
    private noctuaSearchService: NoctuaSearchService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaLookupService: NoctuaLookupService,
    private sparqlService: SparqlService,
    private noctuaTranslationLoader: NoctuaTranslationLoaderService) {
    this.noctuaTranslationLoader.loadTranslations(english);
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

  cancel() {
    this.dialogRef.close();
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

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
