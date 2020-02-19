import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit, ElementRef, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatOption, MatSort, MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, startWith, distinctUntilChanged, map } from 'rxjs/operators';

import { noctuaAnimations } from '@noctua/animations';
import { NoctuaUtils } from '@noctua/utils/noctua-utils';

import { takeUntil } from 'rxjs/internal/operators';


import { ReviewService } from '../../services/review.service';

import { NoctuaTranslationLoaderService } from '@noctua/services/translation-loader.service';
import { NoctuaFormConfigService, NoctuaUserService, Group, Contributor, Organism } from 'noctua-form-base';
import { NoctuaLookupService } from 'noctua-form-base';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';

import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';
import { NoctuaDataService } from '@noctua.common/services/noctua-data.service';


@Component({
  selector: 'noc-review-filter',
  templateUrl: './review-filter.component.html',
  styleUrls: ['./review-filter.component.scss'],
})

export class ReviewFilterComponent implements OnInit, OnDestroy {
  searchCriteria: any = {};
  filterForm: FormGroup;
  selectedOrganism = {};
  searchFormData: any = []
  cams: any[] = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedContributors: Contributor[] = [];

  //@ViewChild('contributorInput') contributorInput: ElementRef<HTMLInputElement>;
  // @ViewChild('contributorAuto') matAutocomplete: MatAutocomplete;

  filteredOrganisms: Observable<any[]>;
  filteredGroups: Observable<any[]>;
  filteredContributors: Observable<any[]>;
  filteredStates: Observable<any[]>;


  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    public noctuaUserService: NoctuaUserService,
    public noctuaSearchService: NoctuaSearchService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaLookupService: NoctuaLookupService,
    private reviewService: ReviewService,
    private sparqlService: SparqlService,
    private noctuaDataService: NoctuaDataService,
    private noctuaTranslationLoader: NoctuaTranslationLoaderService) {
    this.filterForm = this.createAnswerForm();

    this.unsubscribeAll = new Subject();

    this.searchFormData = this.noctuaFormConfigService.createSearchFormData();
    this.onValueChanges();
  }

  ngOnInit(): void {


  }


  search() {
    let searchCriteria = this.filterForm.value;

    console.dir(searchCriteria)
    this.noctuaSearchService.search(searchCriteria);
  }

  createAnswerForm() {
    return new FormGroup({
      gps: new FormControl(),
      goterms: new FormControl(),
      pmids: new FormControl(),
      contributors: new FormControl(),
      groups: new FormControl(),
      organisms: new FormControl(),
      states: new FormControl()
    });
  }


  onValueChanges() {
    const self = this;

    this.filterForm.get('goterms').valueChanges
      .distinctUntilChanged()
      .debounceTime(400)
      .subscribe(data => {
        let searchData = self.searchFormData['goterm'];
        this.noctuaLookupService.golrTermLookup(data, searchData.id).subscribe(response => {
          self.searchFormData['goterm'].searchResults = response
        });
      });

    this.filterForm.get('gps').valueChanges
      .distinctUntilChanged()
      .debounceTime(400)
      .subscribe(data => {
        let searchData = self.searchFormData['gp'];
        this.noctuaLookupService.golrTermLookup(data, searchData.id).subscribe(response => {
          self.searchFormData['gp'].searchResults = response
        })
      })

    this.filteredOrganisms = this.filterForm.controls.organisms.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value['short_name']),
        map(organism => organism ? this.reviewService.filterOrganisms(organism) : this.reviewService.organisms.slice())
      )

    this.filteredContributors = this.filterForm.controls.contributors.valueChanges
      .pipe(
        startWith(''),
        map(
          value => typeof value === 'string' ? value : value['name']),
        map(contributor => contributor ? this.noctuaUserService.filterContributors(contributor) : this.noctuaUserService.contributors.slice())
      )

    this.filteredGroups = this.filterForm.controls.groups.valueChanges
      .pipe(
        startWith(''),
        map(
          value => typeof value === 'string' ? value : value['name']),
        map(group => group ? this.noctuaUserService.filterGroups(group) : this.noctuaUserService.groups.slice())
      )

    this.filteredStates = this.filterForm.controls.states.valueChanges
      .pipe(
        startWith(''),
        map(
          value => typeof value === 'string' ? value : value['name']),
        map(state => state ? this.reviewService.filterStates(state) : this.reviewService.states.slice())
      )
  }

  termDisplayFn(term): string | undefined {
    return term && term.id ? `${term.label} (${term.id})` : undefined;
  }

  evidenceDisplayFn(evidence): string | undefined {
    return evidence && evidence.id ? `${evidence.label} (${evidence.id})` : undefined;
  }

  contributorDisplayFn(contributor: Contributor): string | undefined {
    return contributor ? contributor.name : undefined;
  }

  groupDisplayFn(group: Group): string | undefined {
    return group ? group.name : undefined;
  }

  organismDisplayFn(organism: Organism): string | undefined {
    return organism ? organism.taxonName : undefined;
  }

  stateDisplayFn(state): string | undefined {
    return state ? state.name : undefined;
  }

  close() {
    this.reviewService.closeLeftDrawer();
  }

  clear() {
    this.noctuaSearchService.clearSearchCriteria();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  add(event: MatChipInputEvent, filterType): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.noctuaSearchService.searchCriteria[filterType].push(value.trim());
      this.noctuaSearchService.updateSearch();
      this.filterForm.controls[filterType].setValue('');
    }

    if (input) {
      input.value = '';
    }
  }

  remove(item: Contributor | Group, filterType): void {
    const index = this.noctuaSearchService.searchCriteria[filterType].indexOf(item);

    if (index >= 0) {
      this.noctuaSearchService.searchCriteria[filterType].splice(index, 1);
      this.noctuaSearchService.updateSearch();
    }
  }

  selected(event: MatAutocompleteSelectedEvent, filterType): void {
    this.noctuaSearchService.searchCriteria[filterType].push(event.option.value);
    this.noctuaSearchService.updateSearch();
    this.filterForm.controls[filterType].setValue('');
  }

  downloadFilter() {
    this.noctuaSearchService.downloadSearchConfig();
  }

  onFileChange(event) {
    const self = this;
    let reader = new FileReader();


    //console.log(event, control)

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsText(file);

      reader.onload = () => {
        try {
          let searchCriteria = JSON.parse(reader.result as string);
          self.noctuaSearchService.uploadSearchConfig(searchCriteria);
          //document.getElementById('elementid').value = "";

        } catch (exception) {
          alert("invalid file")
        }
      };
    }
  }

}
