import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  NoctuaFormConfigService,
  NoctuaUserService
} from 'noctua-form-base';
import { NoctuaSearchService } from './../../services/noctua-search.service';
import { NoctuaSearchMenuService } from '../../services/search-menu.service';

@Component({
  selector: 'noc-search-groups',
  templateUrl: './search-groups.component.html',
  styleUrls: ['./search-groups.component.scss'],
})

export class SearchGroupsComponent implements OnInit, OnDestroy {
  searchCriteria: any = {};
  searchForm: FormGroup;
  groupsForm: FormGroup;
  searchFormData: any = []
  // groups: any[] = [];
  // groups: any[] = [];

  private unsubscribeAll: Subject<any>;

  constructor(public noctuaUserService: NoctuaUserService,
    public noctuaSearchMenuService: NoctuaSearchMenuService,
    private noctuaSearchService: NoctuaSearchService,
    private formBuilder: FormBuilder,
    public noctuaFormConfigService: NoctuaFormConfigService) {
    // this.groups = this.noctuaSearchService.groups;

    this.unsubscribeAll = new Subject();
    this.groupsForm = this.formBuilder.group({
      groups: []
    });
  }

  ngOnInit(): void {
    //this.searchForm = this.createSearchForm();
  }

  selectGroup(group) {
    this.searchCriteria.group = group;
    this.noctuaSearchService.search(this.searchCriteria);
  }


  search() {
    let searchCriteria = this.searchForm.value;

    this.noctuaSearchService.search(searchCriteria);
  }

  close() {
    this.noctuaSearchMenuService.closeLeftDrawer();
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
