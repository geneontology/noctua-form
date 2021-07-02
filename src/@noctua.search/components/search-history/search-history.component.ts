import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { NoctuaFormConfigService, NoctuaUserService } from 'noctua-form-base';
import { NoctuaSearchService } from './../..//services/noctua-search.service';
import { NoctuaSearchMenuService } from '../../services/search-menu.service';
import { takeUntil } from 'rxjs/operators';
import { SearchHistory } from './../../models/search-history';

@Component({
  selector: 'noc-search-history',
  templateUrl: './search-history.component.html',
  styleUrls: ['./search-history.component.scss']
})
export class SearchHistoryComponent implements OnInit, OnDestroy {
  searchCriteria: any = {};
  searchHistory: SearchHistory[] = [];

  private _unsubscribeAll: Subject<any>;

  constructor(public noctuaUserService: NoctuaUserService,
    public noctuaSearchMenuService: NoctuaSearchMenuService,
    public noctuaSearchService: NoctuaSearchService,
    public noctuaFormConfigService: NoctuaFormConfigService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.noctuaSearchService.onSearchHistoryChanged.pipe(
      takeUntil(this._unsubscribeAll))
      .subscribe((searchHistory: SearchHistory[]) => {
        this.searchHistory = searchHistory;
      });
  }

  selectSearch(searchHistoryItem: SearchHistory) {
    this.noctuaSearchService.searchCriteria = searchHistoryItem.getSearchCriteria();
    this.noctuaSearchService.updateSearch(false);
  }

  clear() {
    this.noctuaSearchService.clearHistory();
  }

  close() {
    this.noctuaSearchMenuService.closeLeftDrawer();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
