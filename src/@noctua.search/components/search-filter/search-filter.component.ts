import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, Subject } from 'rxjs';
import { startWith, map, distinctUntilChanged, debounceTime, takeUntil } from 'rxjs/operators';
import { NoctuaFormConfigService, NoctuaUserService, Group, Contributor, Organism, EntityDefinition, ActivityNode, EntityLookup } from '@geneontology/noctua-form-base';
import { NoctuaLookupService, NoctuaFormUtils } from '@geneontology/noctua-form-base';
import { NoctuaSearchService } from './../../services/noctua-search.service';
import { NoctuaSearchMenuService } from '../../services/search-menu.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';


import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import { InlineReferenceService } from '@noctua.editor/inline-reference/inline-reference.service';
import { NoctuaConfirmDialogService } from '@noctua/components/confirm-dialog/confirm-dialog.service';
import { SearchFilterType } from './../../models/search-criteria';
import { NoctuaDataService } from '@noctua.common/services/noctua-data.service';


const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'noc-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SearchFilterComponent implements OnInit, OnDestroy {
  SearchFilterType = SearchFilterType

  @ViewChildren('searchInput')
  searchInput: QueryList<ElementRef>;
  searchCriteria: any = {};
  isDateRange = false;
  filterForm: FormGroup;
  selectedOrganism = {};
  searchFormData: any = [];
  cams: any[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedContributors: Contributor[] = [];
  filteredOrganisms: Observable<any[]>;
  filteredGroups: Observable<any[]>;
  filteredContributors: Observable<any[]>;
  filteredStates: Observable<any[]>;

  gpNode: ActivityNode;
  termNode: ActivityNode;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private noctuaDataService: NoctuaDataService,
    public noctuaUserService: NoctuaUserService,
    private confirmDialogService: NoctuaConfirmDialogService,
    private inlineReferenceService: InlineReferenceService,
    public noctuaSearchMenuService: NoctuaSearchMenuService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaLookupService: NoctuaLookupService,
    public noctuaSearchService: NoctuaSearchService) {

    this.gpNode = EntityDefinition.generateBaseTerm([EntityDefinition.GoMolecularEntity]);
    this.termNode = EntityDefinition.generateBaseTerm([
      EntityDefinition.GoMolecularFunction,
      EntityDefinition.GoBiologicalProcess,
      EntityDefinition.GoAllCellularComponent,
      EntityDefinition.GoBiologicalPhase,
      EntityDefinition.GoAnatomicalEntity,
      EntityDefinition.GoCellTypeEntity,
      EntityDefinition.UberonStage,
    ]);
    this._unsubscribeAll = new Subject();
    this.filterForm = this.createAnswerForm();
    this._onValueChanges();
  }

  ngOnInit(): void {
    this.noctuaDataService.onOrganismsChanged
      .pipe(
        takeUntil(this._unsubscribeAll))
      .subscribe(organism => {
        if (organism) {
          this.noctuaSearchService.organisms = organism
          this._onValueOrganismChanges();

          console.log('loaded')
        }
      });
  }

  createAnswerForm() {
    return new FormGroup({
      ids: new FormControl(),
      gps: new FormControl(),
      terms: new FormControl(),
      pmids: new FormControl(),
      contributors: new FormControl(),
      groups: new FormControl(),
      organisms: new FormControl(),
      titles: new FormControl(),
      states: new FormControl(),
      exactdates: new FormControl(),
      startdates: new FormControl(),
      enddates: new FormControl(),
      isDateRange: new FormControl(),
      exactTerm: new FormControl(),
    });
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
    this.noctuaSearchMenuService.closeLeftDrawer();
  }

  clear() {
    this.noctuaSearchService.clearSearchCriteria();
    this.searchInput.forEach((item) => {
      item.nativeElement.value = null;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  add(event: MatChipInputEvent, filterType, limit = 10): void {
    const input = event.input;
    const value = event.value;

    if (this.noctuaSearchService.searchCriteria[filterType].length >= limit) {
      this.confirmDialogService.openInfoToast(`Reached maximum number of ${filterType} filters allowed`, 'OK');
    } else if ((value || '').trim()) {

      if (filterType === this.SearchFilterType.ids) {
        this.noctuaSearchService.searchCriteria[filterType].push(
          NoctuaFormUtils.cleanModelId(value.trim()));
      } else {
        this.noctuaSearchService.searchCriteria[filterType].push(value.trim());
      }
      this.noctuaSearchService.updateSearch(true);
      this.searchInput.forEach((item) => {
        item.nativeElement.value = null;
      });
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

    this.searchInput.forEach((item) => {
      item.nativeElement.value = null;
    });

    this.filterForm.controls[filterType].setValue('');
  }

  openAddReference(event, name: string) {

    const data = {
      formControl: this.filterForm.controls[name] as FormControl,
    };
    this.inlineReferenceService.open(event.target, { data });

  }


  downloadFilter() {
    this.noctuaSearchService.downloadSearchConfig();
  }

  private _onValueChanges() {
    const self = this;

    const lookupFunc = self.noctuaLookupService.lookupFunc()

    this.filterForm.get('terms').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(400)
    ).subscribe(data => {
      const lookup: EntityLookup = self.termNode.termLookup;

      lookupFunc.termLookup(data, lookup.requestParams).subscribe(response => {
        lookup.results = response;
      });
    });

    this.filterForm.get('gps').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(400)
    ).subscribe(data => {
      const lookup: EntityLookup = self.gpNode.termLookup;

      lookupFunc.termLookup(data, lookup.requestParams).subscribe(response => {
        lookup.results = response;
      });
    });

    this.filterForm.get('isDateRange').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(400)
    ).subscribe(value => {
      this.isDateRange = value;
    });

    this.filterForm.get('exactTerm').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(400)
    ).subscribe(value => {
      this.noctuaSearchService.searchCriteria.expand = !value
      this.noctuaSearchService.updateSearch();
    });

    this.filteredContributors = this.filterForm.controls['contributors'].valueChanges
      .pipe(
        startWith(''),
        map(
          value => typeof value === 'string' ? value : value['name']),
        map(contributor => contributor ? this.noctuaUserService.filterContributors(contributor) : this.noctuaUserService.contributors.slice())
      );

    this.filteredGroups = this.filterForm.controls['groups'].valueChanges
      .pipe(
        startWith(''),
        map(
          value => typeof value === 'string' ? value : value['name']),
        map(group => group ? this.noctuaUserService.filterGroups(group) : this.noctuaUserService.groups.slice())
      );



    this.filteredStates = this.filterForm.controls['states'].valueChanges
      .pipe(
        startWith(''),
        map(
          value => typeof value === 'string' ? value : value['name']),
        map(state => state ? this.noctuaSearchService.filterStates(state) : this.noctuaSearchService.states.slice())
      );
  }

  private _onValueOrganismChanges() {
    const self = this;

    this.filteredOrganisms = this.filterForm.controls['organisms'].valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value['short_name']),
        map(organism => organism ? this.noctuaSearchService.filterOrganisms(organism) : this.noctuaSearchService.organisms.slice())
      );

  }


  onFileChange(event) {
    const self = this;
    let reader = new FileReader();

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
