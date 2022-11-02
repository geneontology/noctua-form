

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import {
  Cam,
  NoctuaUserService,
  NoctuaFormConfigService,
  noctuaFormConfig,
  CamService,
  ActivityDisplayType
} from '@geneontology/noctua-form-base';

import { takeUntil } from 'rxjs/operators';
import { noctuaAnimations } from '@noctua/animations';
import { NoctuaReviewSearchService } from '@noctua.search/services/noctua-review-search.service';
import { ArtBasket } from '@noctua.search/models/art-basket';
import { LeftPanel, MiddlePanel, RightPanel } from '@noctua.search/models/menu-panels';
import { NoctuaSearchMenuService } from '@noctua.search/services/search-menu.service';
import { ReviewMode } from '@noctua.search/models/review-mode';
import { TableOptions } from '@noctua.common/models/table-options';
import { SearchFilterType } from '@noctua.search/models/search-criteria';

@Component({
  selector: 'noc-cams-review',
  templateUrl: './cams-review.component.html',
  styleUrls: ['./cams-review.component.scss'],
  animations: noctuaAnimations,
})
export class CamsReviewComponent implements OnInit, OnDestroy {
  SearchFilterType = SearchFilterType
  ReviewMode = ReviewMode;
  LeftPanel = LeftPanel;
  MiddlePanel = MiddlePanel;
  RightPanel = RightPanel;

  cams: Cam[] = [];
  searchResults = [];

  displayReplaceForm = {
    replaceSection: false,
    replaceActions: false
  };
  artBasket: ArtBasket;

  tableOptions: TableOptions = {
    displayType: ActivityDisplayType.TREE_TABLE,
    slimViewer: false,
    editableTerms: true,
    editableEvidence: true,
    editableReference: true,
    editableWith: true,
  };

  loadingSpinner: any = {
    color: 'primary',
    mode: 'indeterminate'
  };

  noctuaFormConfig = noctuaFormConfig;

  searchCriteria: any = {};

  private _unsubscribeAll: Subject<any>;

  constructor(
    public camService: CamService,
    public noctuaSearchMenuService: NoctuaSearchMenuService,
    public noctuaReviewSearchService: NoctuaReviewSearchService,
    public noctuaUserService: NoctuaUserService,
    public noctuaFormConfigService: NoctuaFormConfigService) {

    this._unsubscribeAll = new Subject();

    this.camService.onCamsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(cams => {
        if (!cams) {
          return;
        }
        this.cams = cams;
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

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
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

  compareCategory(a: any, b: any) {
    if (a && b) {
      return (a.name === b.name);
    }
    return false;
  }

}
