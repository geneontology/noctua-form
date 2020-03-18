import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { NoctuaFormConfigService, NoctuaUserService, NoctuaLookupService } from 'noctua-form-base';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'noc-search-relation',
  templateUrl: './search-relation.component.html',
  styleUrls: ['./search-relation.component.scss']
})
export class SearchRelationComponent implements OnInit, OnDestroy {
  searchCriteria: any = {};
  searchForm: FormGroup;
  selectedOrganism = {};
  searchFormData: any = [];
  cams: any[] = [];

  filteredOrganisms: Observable<any[]>;
  filteredGroups: Observable<any[]>;
  filteredContributors: Observable<any[]>;

  private unsubscribeAll: Subject<any>;

  constructor(public noctuaUserService: NoctuaUserService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaLookupService: NoctuaLookupService,
    private noctuaSearchService: NoctuaSearchService) {
    this.searchForm = this.createAnswerForm();

    this.unsubscribeAll = new Subject();

    this.searchFormData = this.noctuaFormConfigService.createSearchFormData();
    this.onValueChanges();
  }

  ngOnInit(): void { }

  createAnswerForm() {
    return new FormGroup({
      subject: new FormControl(),
      predicate: new FormControl(),
      object: new FormControl(),
    });
  }

  onValueChanges() {
    const self = this;

    this.searchForm.get('subject').valueChanges
      .distinctUntilChanged()
      .debounceTime(400)
      .subscribe(data => {
        let searchData = self.searchFormData['subject'];
        this.noctuaLookupService.golrTermLookup(data, searchData.id).subscribe(response => {
          self.searchFormData['subject'].searchResults = response;
        });
      });

    this.searchForm.get('object').valueChanges
      .distinctUntilChanged()
      .debounceTime(400)
      .subscribe(data => {
        let searchData = self.searchFormData['object'];
        this.noctuaLookupService.golrTermLookup(data, searchData.id).subscribe(response => {
          self.searchFormData['object'].searchResults = response;
        });
      });

    this.searchForm.get('predicate').valueChanges
      .distinctUntilChanged()
      .debounceTime(400)
      .subscribe(data => {
        let searchData = self.searchFormData['predicate'];
        this.noctuaLookupService.golrTermLookup(data, searchData.id).subscribe(response => {
          self.searchFormData['predicate'].searchResults = response;
        });
      });
  }

  termDisplayFn(term): string | undefined {
    return term ? term.label : undefined;
  }


  contributorDisplayFn(contributor): string | undefined {
    return contributor ? contributor.name : undefined;
  }

  search() {
    const searchCriteria = this.searchForm.value;

    this.noctuaSearchService.search(searchCriteria);
  }

  clear() {
    this.searchForm.controls.subject.setValue('');
    this.searchForm.controls.predicate.setValue('');
    this.searchForm.controls.object.setValue('');
  }

  close() {
    this.noctuaSearchService.closeLeftDrawer();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
