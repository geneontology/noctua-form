import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { NoctuaFormConfigService, NoctuaUserService, Group, Contributor, Organism } from 'noctua-form-base';
import { NoctuaLookupService } from 'noctua-form-base';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';

@Component({
  selector: 'noc-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
})

export class SearchFilterComponent implements OnInit, OnDestroy {
  searchCriteria: any = {};
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

  private unsubscribeAll: Subject<any>;

  constructor(public noctuaUserService: NoctuaUserService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaLookupService: NoctuaLookupService,
    private noctuaSearchService: NoctuaSearchService) {
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
      titles: new FormControl(),
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
        map(organism => organism ? this.noctuaSearchService.filterOrganisms(organism) : this.noctuaSearchService.organisms.slice())
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
        map(state => state ? this.noctuaSearchService.filterStates(state) : this.noctuaSearchService.states.slice())
      )
  }

  termDisplayFn(term): string | undefined {
    return term ? term.label : undefined;
  }

  evidenceDisplayFn(evidence): string | undefined {
    return evidence ? evidence.label : undefined;
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
    this.noctuaSearchService.closeLeftDrawer();
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
