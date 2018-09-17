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
import { locale as english } from './i18n/en';

import { advancedSearchData } from './advanced-search.tokens';
import { AdvancedSearchOverlayRef } from './advanced-search-ref';

import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss']
})

export class NoctuaAdvancedSearchComponent implements OnInit, OnDestroy {
  searchCriteria: any = {};
  searchForm: FormGroup;
  cams: any[] = [];

  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    public dialogRef: AdvancedSearchOverlayRef,
    @Inject(advancedSearchData) public data: any,
    private noctuaSearchService: NoctuaSearchService,
    private noctuaTranslationLoader: NoctuaTranslationLoaderService) {
    this.noctuaTranslationLoader.loadTranslations(english);
    this.searchForm = this.createAnswerForm();

    console.dir(data);
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void { }

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
      goTerm: new FormControl(this.searchCriteria.goTerm),
      geneProduct: new FormControl(this.searchCriteria.geneProduct),
      pmid: new FormControl(this.searchCriteria.pmid),
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
