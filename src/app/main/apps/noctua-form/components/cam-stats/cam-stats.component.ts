import { Component, OnInit, OnDestroy, NgZone, Input, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivityNode, Cam, CamService, CamSummary, Contributor, Entity, EntityType, LeftPanel, NoctuaFormConfigService, NoctuaFormMenuService, NoctuaGraphService, NoctuaLookupService, NoctuaUserService, RightPanel, TermsSummary } from 'noctua-form-base';
import { takeUntil } from 'rxjs/operators';
import { MatDrawer } from '@angular/material/sidenav';
import { SearchCriteria } from '@noctua.search/models/search-criteria';
import { environment } from 'environments/environment';
import { NoctuaReviewSearchService } from '@noctua.search/services/noctua-review-search.service';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';
import { getColor } from '@noctua.common/data/noc-colors';
import { orderBy } from 'lodash';

enum StatsType {
  GENERAL = 'general',
  GP = "GP",
  MF = 'MF',
  BP = "BP",
  CC = "CC",
  TERM = 'term',
  CONTRIBUTION = "contribution",
  STATEMENT = "statement"
}

@Component({
  selector: 'noc-cam-stats',
  templateUrl: './cam-stats.component.html',
  styleUrls: ['./cam-stats.component.scss']
})
export class CamStatsComponent implements OnInit, OnDestroy {
  EntityType = EntityType;
  StatsType = StatsType;

  @Input('panelDrawer')
  panelDrawer: MatDrawer;
  cam: Cam;
  termsSummary: TermsSummary;

  loadingSpinner: any = {
    color: 'primary',
    mode: 'indeterminate'
  };

  selectedStatsType = StatsType.GENERAL;

  statsTypes = [
    {
      name: StatsType.GENERAL,
      label: 'General'
    }, {
      name: StatsType.GP,
      label: 'GP'
    }, {
      name: StatsType.TERM,
      label: 'Terms'
    }, {
      name: StatsType.STATEMENT,
      label: 'Statements'
    }, {
      name: StatsType.CONTRIBUTION,
      label: 'Contribution'
    }
  ]



  // options


  private _unsubscribeAll: Subject<any>;


  pies = []

  constructor(
    private zone: NgZone,
    private noctuaLookupService: NoctuaLookupService,
    private _noctuaGraphService: NoctuaGraphService,
    public noctuaFormMenuService: NoctuaFormMenuService,
    public camService: CamService,
    public noctuaUserService: NoctuaUserService,
    public noctuaReviewSearchService: NoctuaReviewSearchService,
    public noctuaSearchService: NoctuaSearchService,
    public noctuaFormConfigService: NoctuaFormConfigService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._noctuaGraphService.onCamGraphChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cam: Cam) => {
        if (!cam) {
          return;
        }
        this.cam = cam;
        this.termsSummary = this._noctuaGraphService.getTerms(this.cam.graph)
      });

  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  selectStatsType(name: StatsType) {
    this.selectedStatsType = name;
  }


  openSearch(node) {
    this.noctuaLookupService.getTermDetail(node.term.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((term) => {
        if (!term) return;
        this.noctuaReviewSearchService.onCamTermSearch.next(term)
        this.noctuaFormMenuService.openLeftDrawer(LeftPanel.findReplace);
      })
  }

  search(node: ActivityNode) {
    this.noctuaReviewSearchService.searchCriteria['terms'] = [node.term];
    this.noctuaReviewSearchService.updateSearch();
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

  openTermDetail(term) {
    this.noctuaSearchService.onDetailTermChanged.next(term)
    this.noctuaFormMenuService.openRightDrawer(RightPanel.termDetail);
  }


  close() {
    this.panelDrawer.close();
  }

}
