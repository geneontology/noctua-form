

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import {
  NoctuaUserService,
  NoctuaFormConfigService,
  NoctuaFormMenuService,
  NoctuaActivityFormService,
  CamsService,
  CamStats
} from 'noctua-form-base';
import { takeUntil } from 'rxjs/operators';
import { noctuaAnimations } from '@noctua/animations';
import { NoctuaReviewSearchService } from '@noctua.search/services/noctua-review-search.service';
import { ReviewMode } from '@noctua.search/models/review-mode';
import { NoctuaSearchMenuService } from '@noctua.search/services/search-menu.service';
import { MiddlePanel, LeftPanel, RightPanel } from '@noctua.search/models/menu-panels';
import { ArtBasket } from '@noctua.search/models/art-basket';

@Component({
  selector: 'noc-cams-review-changes',
  templateUrl: './cams-review-changes.component.html',
  styleUrls: ['./cams-review-changes.component.scss'],
  animations: noctuaAnimations,
})
export class CamsReviewChangesComponent implements OnInit, OnDestroy {

  ReviewMode = ReviewMode;
  LeftPanel = LeftPanel;
  MiddlePanel = MiddlePanel;
  RightPanel = RightPanel;
  stats: any[] = [];
  artBasket: ArtBasket;
  summary;

  displayedColumns = [
    'category',
    'count'
  ];

  private _unsubscribeAll: Subject<any>;

  constructor(
    public camsService: CamsService,
    public noctuaReviewSearchService: NoctuaReviewSearchService,
    public noctuaSearchMenuService: NoctuaSearchMenuService,
    public noctuaUserService: NoctuaUserService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaActivityFormService: NoctuaActivityFormService,
    public noctuaFormMenuService: NoctuaFormMenuService) {

    this._unsubscribeAll = new Subject();

    this.camsService.onCamsCheckoutChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(summary => {
        if (!summary) {
          return;
        }

        this.summary = summary;

        this.stats = this.generateStats(summary.stats);

      });
  }

  ngOnInit(): void {
    this.noctuaReviewSearchService.onArtBasketChanged.pipe(
      takeUntil(this._unsubscribeAll))
      .subscribe((artBasket: ArtBasket) => {
        if (artBasket) {
          this.artBasket = artBasket;
        }
      });
  }

  generateStats(stats: CamStats): any[] {
    stats.updateTotal();
    const result = [{
      category: 'Genes',
      count: stats.gpsCount
    }, {
      category: 'Terms',
      count: stats.termsCount
    }, {
      category: 'Evidence',
      count: stats.evidenceCount
    }, {
      category: 'Reference',
      count: stats.referencesCount
    }, {
      category: 'With',
      count: stats.withsCount
    }, {
      category: 'Relations',
      count: stats.relationsCount
    }];

    return result;
  }

  selectMiddlePanel(panel) {
    this.noctuaSearchMenuService.selectMiddlePanel(panel);

    switch (panel) {
      case MiddlePanel.cams:
        this.noctuaSearchMenuService.selectLeftPanel(LeftPanel.filter);
        break;
      case MiddlePanel.camsReview:
        this.noctuaSearchMenuService.selectLeftPanel(LeftPanel.artBasket);
        break;
      case MiddlePanel.reviewChanges:
        this.noctuaSearchMenuService.selectLeftPanel(LeftPanel.artBasket);
        break;
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
