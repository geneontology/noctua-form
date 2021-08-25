import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { NoctuaFormConfigService, NoctuaUserService, NoctuaLookupService } from 'noctua-form-base';
import { NoctuaSearchService } from './../..//services/noctua-search.service';
import { startWith, map, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { NoctuaSearchMenuService } from '../../services/search-menu.service';

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
    public noctuaSearchMenuService: NoctuaSearchMenuService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaSearchService: NoctuaSearchService) {
    this.searchForm = this.createAnswerForm();

    this.unsubscribeAll = new Subject();


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

    this.searchForm.get('subject').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(400)
    ).subscribe(data => {

    });

    this.searchForm.get('object').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(400)
    ).subscribe(data => {

    });

    this.searchForm.get('predicate').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(400)
    ).subscribe(data => {

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
    this.noctuaSearchMenuService.closeLeftDrawer();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
