import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivityNode, CamService, LeftPanel, NoctuaFormConfigService, NoctuaLookupService, NoctuaUserService } from '@geneontology/noctua-form-base';
import { NoctuaSearchService } from './../..//services/noctua-search.service';
import { NoctuaSearchMenuService } from '../../services/search-menu.service';
import { takeUntil } from 'rxjs/operators';
import { NoctuaReviewSearchService } from './../../services/noctua-review-search.service';
import { NoctuaSearchDialogService } from './../../services/dialog.service';
import { MatDrawer } from '@angular/material/sidenav';
import { SearchCriteria } from '@noctua.search/models/search-criteria';
import { environment } from 'environments/environment';
import { NoctuaCommonMenuService } from '@noctua.common/services/noctua-common-menu.service';

@Component({
  selector: 'noc-term-detail',
  templateUrl: './term-detail.component.html',
  styleUrls: ['./term-detail.component.scss']
})
export class TermDetailComponent implements OnInit, OnDestroy {

  @Input('panelDrawer')
  panelDrawer: MatDrawer;

  loadingSpinner: any = {
    color: 'primary',
    mode: 'indeterminate'
  };

  termDetail: any = {}



  private _unsubscribeAll: Subject<any>;

  constructor(
    private noctuaLookupService: NoctuaLookupService,
    public noctuaCommonMenuService: NoctuaCommonMenuService,
    public camService: CamService,
    public noctuaSearchDialogService: NoctuaSearchDialogService,
    public noctuaUserService: NoctuaUserService,
    public noctuaReviewSearchService: NoctuaReviewSearchService,
    public noctuaSearchMenuService: NoctuaSearchMenuService,
    public noctuaSearchService: NoctuaSearchService,
    public noctuaFormConfigService: NoctuaFormConfigService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.noctuaSearchService.onDetailTermChanged.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((term: ActivityNode) => {
        if (!term) {
          return;
        }
        this.loadTerm(term.term.id)
      })
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  loadTerm(termId) {
    this.noctuaLookupService.getTermDetail(termId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.termDetail = res
      })
  }


  search(id) {
    this.noctuaReviewSearchService.searchCriteria['terms'] = [{ id }];
    this.noctuaReviewSearchService.updateSearch();
  }

  openSearchReplace(replaceBy) {
    this.noctuaLookupService.getTermDetail(this.termDetail.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((term) => {
        if (!term) return;
        this.noctuaReviewSearchService.onCamTermSearch.next(term)
        this.noctuaCommonMenuService.selectLeftPanel(LeftPanel.findReplace);
        this.noctuaCommonMenuService.openLeftDrawer();
      })

    this.noctuaLookupService.getTermDetail(replaceBy)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((term) => {
        if (!term) return;

        this.noctuaReviewSearchService.onCamReplaceTermSearch.next(term)
      })


  }

  searchModels(node: ActivityNode) {
    const searchCriteria = new SearchCriteria()
    searchCriteria.terms = [node.term]
    const url = `${environment.noctuaLandingPageUrl}?${searchCriteria.build()}`
    window.open(url, '_blank');
  }

  searchModelsByContributor(node: ActivityNode) {
    const searchCriteria = new SearchCriteria()
    searchCriteria.terms = [node.term]
    searchCriteria.contributors = [this.noctuaUserService.user]
    const url = `${environment.noctuaLandingPageUrl}?${searchCriteria.build()}`
    window.open(url, '_blank')

  }


  close() {
    this.panelDrawer.close();
  }

}
