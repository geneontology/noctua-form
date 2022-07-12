import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { noctuaAnimations } from './../../../../@noctua/animations';
import {
  Cam,
  Contributor,
  NoctuaUserService,
  NoctuaFormConfigService,
  CamService,
} from '@geneontology/noctua-form-base';

import { FormGroup } from '@angular/forms';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { CamPage } from '@noctua.search/models/cam-page';
import { NoctuaSearchMenuService } from '@noctua.search/services/search-menu.service';
import { NoctuaCommonMenuService } from '@noctua.common/services/noctua-common-menu.service';
import { ReviewMode } from '@noctua.search/models/review-mode';
import { LeftPanel, MiddlePanel, RightPanel } from '@noctua.search/models/menu-panels';
import { ArtBasket } from '@noctua.search/models/art-basket';
import { NoctuaReviewSearchService } from '@noctua.search/services/noctua-review-search.service';
import { NgScrollbar } from 'ngx-scrollbar';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { NoctuaDoctorMenuService } from '@noctua.doctor/services/doctor-menu.service';
import { WorkbenchId } from '@noctua.common/models/workench-id';

@Component({
  selector: 'noc-noctua-doctor',
  templateUrl: './noctua-doctor.component.html',
  styleUrls: ['./noctua-doctor.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  animations: noctuaAnimations
})
export class NoctuaDoctorComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('leftDrawer', { static: true })
  leftDrawer: MatDrawer;

  @ViewChild('rightDrawer', { static: true })
  rightDrawer: MatDrawer;

  @ViewChild(PerfectScrollbarDirective)
  scrollbarRef?: PerfectScrollbarDirective;

  // @ViewChild(NgScrollbar) scrollbarRef: NgScrollbar;

  loadingSpinner: any = {
    color: 'primary',
    mode: 'indeterminate'
  };

  scrollbarConfig = {
    suppressScrollX: true
  }

  ReviewMode = ReviewMode;
  LeftPanel = LeftPanel;
  MiddlePanel = MiddlePanel;
  RightPanel = RightPanel;
  artBasket: ArtBasket = new ArtBasket();

  camPage: CamPage;
  public cam: Cam;
  public user: Contributor;

  searchResults = [];
  modelId = '';
  searchCriteria: any = {};
  searchFormData: any = [];
  searchForm: FormGroup;

  cams: any[] = [];

  private _unsubscribeAll: Subject<any>;

  constructor(
    private route: ActivatedRoute,
    private camService: CamService,

    public noctuaDoctorMenuService: NoctuaDoctorMenuService,

    public noctuaReviewSearchService: NoctuaReviewSearchService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaCommonMenuService: NoctuaCommonMenuService,
    public noctuaSearchMenuService: NoctuaSearchMenuService,
    public noctuaUserService: NoctuaUserService,
    public noctuaSearchService: NoctuaSearchService,
  ) {
    this._unsubscribeAll = new Subject();

    this.route
      .queryParams
      .subscribe(params => {
        const baristaToken = params['barista_token'] || null;
        this.noctuaUserService.getUser(baristaToken);
      });

    this.noctuaSearchService.onCamsPageChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((camPage: CamPage) => {
        if (!camPage) {
          return;
        }
        this.camPage = camPage;
      });

    this.noctuaUserService.onUserChanged.pipe(
      distinctUntilChanged(this.noctuaUserService.distinctUser),
      takeUntil(this._unsubscribeAll))
      .subscribe((user: Contributor) => {
        if (user === undefined) {
          return;
        }
        this.noctuaFormConfigService.setupUrls();
        this.noctuaFormConfigService.setUniversalUrls();
        this.noctuaSearchService.setup();
        this.noctuaReviewSearchService.setup();
      });
  }

  ngOnInit(): void {
    this.noctuaSearchMenuService.setLeftDrawer(this.leftDrawer);
    this.noctuaSearchMenuService.setRightDrawer(this.rightDrawer);

    this.rightDrawer.open();

    this.noctuaSearchService.onCamsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(cams => {
        this.cams = cams;
      });

    this.noctuaReviewSearchService.onArtBasketChanged.pipe(
      takeUntil(this._unsubscribeAll))
      .subscribe((artBasket: ArtBasket) => {
        if (artBasket) {
          this.artBasket = artBasket;
        }
      });
  }


  ngAfterViewInit(): void {
    this.noctuaSearchMenuService.resultsViewScrollbar = this.scrollbarRef;
  }

  openLeftDrawer(panel) {
    this.noctuaSearchMenuService.selectLeftPanel(panel);
    this.noctuaSearchMenuService.openLeftDrawer();
  }

  selectMiddlePanel(panel) {
    const self = this;
    this.noctuaSearchMenuService.selectMiddlePanel(panel);

    switch (panel) {
      case MiddlePanel.cams:
        this.noctuaSearchMenuService.selectLeftPanel(LeftPanel.filter);
        break;
      case MiddlePanel.camsReview:
        self.camService.reviewChangesCams();
        this.noctuaSearchMenuService.selectLeftPanel(LeftPanel.artBasket);
        break;
      case MiddlePanel.reviewChanges:
        self.camService.reviewChangesCams();
        this.noctuaSearchMenuService.selectLeftPanel(LeftPanel.artBasket);
        break;
    }
  }

  openRightDrawer(panel) {
    this.noctuaSearchMenuService.selectRightPanel(panel);
    this.noctuaSearchMenuService.openRightDrawer();
  }

  toggleLeftDrawer(panel) {
    this.noctuaSearchMenuService.toggleLeftDrawer(panel);
    this.noctuaSearchMenuService.selectMiddlePanel(MiddlePanel.cams);
  }

  createModel(type: WorkbenchId) {
    this.noctuaCommonMenuService.createModel(type);
  }

  openBasketPanel() {
    this.openLeftDrawer(LeftPanel.artBasket);
    this.camService.reviewChangesCams();
    this.noctuaSearchMenuService.selectMiddlePanel(MiddlePanel.camsReview);
    this.noctuaSearchMenuService.reviewMode = ReviewMode.on;
    this.noctuaSearchMenuService.isReviewMode = true;
  }

  toggleReviewMode() {
    if (this.noctuaSearchMenuService.reviewMode === ReviewMode.off) {
      this.noctuaSearchMenuService.reviewMode = ReviewMode.on;
      this.noctuaSearchMenuService.isReviewMode = true;
      // this.noctuaSearchMenuService.closeLeftDrawer();
    } else if (this.noctuaSearchMenuService.reviewMode === ReviewMode.on) {
      this.noctuaReviewSearchService.onClearForm.next(true);
      this.noctuaSearchMenuService.reviewMode = ReviewMode.off;
      this.noctuaSearchMenuService.selectMiddlePanel(MiddlePanel.cams);
      this.noctuaSearchMenuService.selectLeftPanel(LeftPanel.filter);
      this.noctuaSearchMenuService.isReviewMode = false;
    }
  }

  search() {
    const searchCriteria = this.searchForm.value;
    this.noctuaSearchService.search(searchCriteria);
  }

  refresh() {
    this.noctuaSearchService.updateSearch();
  }

  reset() {
    this.noctuaSearchService.clearSearchCriteria();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
