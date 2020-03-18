import { Component, Inject, OnInit, ElementRef, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatOption, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, startWith, distinctUntilChanged, map } from 'rxjs/operators';

import { noctuaAnimations } from '@noctua/animations';
import { NoctuaUtils } from '@noctua/utils/noctua-utils';

import { takeUntil } from 'rxjs/internal/operators';


import { ReviewService } from '../../services/review.service';


import { NoctuaFormConfigService, NoctuaUserService } from 'noctua-form-base';
import { NoctuaLookupService } from 'noctua-form-base';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';

import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';
import { NoctuaDataService } from '@noctua.common/services/noctua-data.service';


@Component({
  selector: 'noc-review-search',
  templateUrl: './review-search.component.html',
  styleUrls: ['./review-search.component.scss'],
})

export class ReviewSearchComponent implements OnInit, OnDestroy {
  searchCriteria: any = {};
  searchForm: FormGroup;
  selectedOrganism = {};
  searchFormData: any = []
  cams: any[] = [];

  filteredOrganisms: Observable<any[]>;
  filteredGroups: Observable<any[]>;
  filteredContributors: Observable<any[]>;

  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    public noctuaUserService: NoctuaUserService,
    private noctuaSearchService: NoctuaSearchService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaLookupService: NoctuaLookupService,
    private reviewService: ReviewService,
    private sparqlService: SparqlService,
    private noctuaDataService: NoctuaDataService,
  ) {
    this.searchForm = this.createAnswerForm();

    this.unsubscribeAll = new Subject();

    this.searchFormData = this.noctuaFormConfigService.createSearchFormData();
    this.onValueChanges();
  }

  ngOnInit(): void { }

  createAnswerForm() {
    return new FormGroup({
      title: new FormControl(),
      gp: new FormControl(),
      goterm: new FormControl(),
      pmid: new FormControl(),
      contributor: new FormControl(),
      group: new FormControl(),
      organism: new FormControl(),
    });
  }

  onValueChanges() {
    const self = this;

    this.searchForm.get('goterm').valueChanges
      .distinctUntilChanged()
      .debounceTime(400)
      .subscribe(data => {
        let searchData = self.searchFormData['goterm'];
        this.noctuaLookupService.golrTermLookup(data, searchData.id).subscribe(response => {
          self.searchFormData['goterm'].searchResults = response
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


    this.filteredOrganisms = this.searchForm.controls.organism.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value['short_name']),
        map(organism => organism ? this.reviewService.filterOrganisms(organism) : this.reviewService.organisms.slice())
      )

    this.filteredContributors = this.searchForm.controls.contributor.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value['name']),
        map(contributor => contributor ? this.noctuaUserService.filterContributors(contributor) : this.noctuaUserService.contributors.slice())
      )

    this.filteredGroups = this.searchForm.controls.group.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value['name']),
        map(group => group ? this.noctuaUserService.filterGroups(group) : this.noctuaUserService.groups.slice())
      )
  }

  termDisplayFn(term): string | undefined {
    return term ? term.label : undefined;
  }

  evidenceDisplayFn(evidence): string | undefined {
    return evidence ? evidence.label : undefined;
  }

  contributorDisplayFn(contributor): string | undefined {
    return contributor ? contributor.name : undefined;
  }

  groupDisplayFn(group): string | undefined {
    return group ? group.name : undefined;
  }

  organismDisplayFn(organism): string | undefined {
    return organism ? organism.taxonName : undefined;
  }

  search() {
    let searchCriteria = this.searchForm.value;

    this.noctuaSearchService.search(searchCriteria);
  }

  clear() {
    this.searchForm.controls.title.setValue('');
    this.searchForm.controls.gp.setValue('');
    this.searchForm.controls.goterm.setValue('');
    this.searchForm.controls.pmid.setValue('');
    this.searchForm.controls.contributor.setValue('');
    this.searchForm.controls.group.setValue('');
    this.searchForm.controls.organism.setValue('');
  }

  close() {
    this.reviewService.closeLeftDrawer();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
