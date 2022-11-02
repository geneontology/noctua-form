import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  ActivityDisplayType,
  ActivityType,
  NoctuaActivityFormService
} from '@geneontology/noctua-form-base';

import { FormGroup } from '@angular/forms';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { CamPage } from '@noctua.search/models/cam-page';
import { NoctuaCommonMenuService } from '@noctua.common/services/noctua-common-menu.service';
import { ReviewMode } from '@noctua.search/models/review-mode';
import { LeftPanel, MiddlePanel, RightPanel } from '@noctua.common/models/menu-panels';
import { ArtBasket } from '@noctua.search/models/art-basket';
import { NoctuaReviewSearchService } from '@noctua.search/services/noctua-review-search.service';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { TableOptions } from '@noctua.common/models/table-options';
import { SettingsOptions } from '@noctua.common/models/graph-settings';
import { WorkbenchId } from '@noctua.common/models/workench-id';
import { CamToolbarOptions } from '@noctua.common/models/cam-toolbar-options';

@Component({
  selector: 'noc-noctua-graph',
  templateUrl: './noctua-graph.component.html',
  styleUrls: ['./noctua-graph.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  animations: noctuaAnimations
})
export class NoctuaGraphComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('leftDrawer', { static: true })
  leftDrawer: MatDrawer;

  @ViewChild('rightDrawer', { static: true })
  rightDrawer: MatDrawer;

  @ViewChild(PerfectScrollbarDirective, { static: false })
  scrollbarRef?: PerfectScrollbarDirective;

  settings: SettingsOptions;
  tableWidth = "550px";

  loadingSpinner: any = {
    color: 'primary',
    mode: 'indeterminate'
  };


  ActivityType = ActivityType;
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

  camToolbarOptions: CamToolbarOptions = {
    showCreateButton: false
  }

  tableOptions: TableOptions = {
    displayType: ActivityDisplayType.SLIM_TREE,
    slimViewer: true,
    editableTerms: true,
    editableEvidence: true,
    editableReference: true,
    editableWith: true,
    showMenu: true
  };

  noctuaFormOptions: TableOptions = {
    displayType: ActivityDisplayType.TREE,
    slimViewer: false,
    editableTerms: true,
    editableEvidence: true,
    editableReference: true,
    editableWith: true,
    showMenu: true
  };

  scrollbarConfig = {
    suppressScrollX: true
  }

  private _unsubscribeAll: Subject<any>;

  constructor(
    private route: ActivatedRoute,
    private camService: CamService,
    public noctuaActivityFormService: NoctuaActivityFormService,
    public noctuaReviewSearchService: NoctuaReviewSearchService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaCommonMenuService: NoctuaCommonMenuService,
    public noctuaUserService: NoctuaUserService,
    public noctuaSearchService: NoctuaSearchService,
  ) {
    this._unsubscribeAll = new Subject();



    this.route
      .queryParams
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(params => {
        this.modelId = params['model_id'] || null;
        const baristaToken = params['barista_token'] || null;
        this.noctuaUserService.getUser(baristaToken);
      });

    this.noctuaUserService.onUserChanged.pipe(
      distinctUntilChanged(this.noctuaUserService.distinctUser),
      takeUntil(this._unsubscribeAll))
      .subscribe((user: Contributor) => {
        this.noctuaFormConfigService.setupUrls();
        this.noctuaFormConfigService.setUniversalUrls();
        this.loadCam(this.modelId);
      });
  }

  ngOnInit(): void {
    this.noctuaCommonMenuService.selectedMiddlePanel = MiddlePanel.camGraph;
    this.noctuaCommonMenuService.setLeftDrawer(this.leftDrawer);
    this.noctuaCommonMenuService.setRightDrawer(this.rightDrawer);

    this.noctuaCommonMenuService.onCamSettingsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((settings: SettingsOptions) => {
        if (!settings) {
          return;
        }
        this.settings = settings;
        this.tableWidth = this.getTableWidth(settings);
      });
  }

  ngAfterViewInit(): void {
    this.noctuaCommonMenuService.resultsViewScrollbar = this.scrollbarRef;
  }

  loadCam(modelId) {
    this.cam = this.camService.getCam(modelId);
  }

  openGraph() {
    this.noctuaCommonMenuService.closeLeftDrawer();
    this.noctuaCommonMenuService.closeRightDrawer();
    this.noctuaCommonMenuService.selectMiddlePanel(MiddlePanel.camGraph)
  }

  openTable() {
    //this.noctuaCommonMenuService.closeLeftDrawer();
    this.noctuaCommonMenuService.closeRightDrawer();
    this.noctuaCommonMenuService.selectMiddlePanel(MiddlePanel.camTable)
  }

  openPreview() {
    this.noctuaCommonMenuService.selectMiddlePanel(MiddlePanel.camPreview)
  }

  openLeftDrawer(panel) {
    this.noctuaCommonMenuService.selectLeftPanel(panel);
    // this.noctuaCommonMenuService.openLeftDrawer();
  }

  selectMiddlePanel(panel: MiddlePanel) {
    const self = this;
    this.noctuaCommonMenuService.selectMiddlePanel(panel);
  }


  openRightDrawer(panel) {
    this.noctuaCommonMenuService.selectRightPanel(panel);
    this.noctuaCommonMenuService.openRightDrawer();
  }

  toggleLeftDrawer(panel) {
    this.noctuaCommonMenuService.toggleLeftDrawer(panel);
  }

  createModel(type: WorkbenchId) {
    this.noctuaCommonMenuService.createModel(type);
  }

  openSettings() {
    this.openRightDrawer(RightPanel.graphSettings)
  }

  getTableWidth(settings: SettingsOptions) {
    let width = 500;

    if (settings.showEvidence) {
      width += settings.showEvidenceCode ? 150 : 0
      width += settings.showReference ? 100 : 0
      width += settings.showWith ? 100 : 0
      width += settings.showGroup ? 100 : 0
      width += settings.showContributor ? 100 : 0

    }

    return width + 'px'
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

  openCamForm() {
    this.camService.initializeForm(this.cam);
    this.noctuaCommonMenuService.selectLeftPanel(LeftPanel.camForm);
    this.noctuaCommonMenuService.closeRightDrawer();
    this.noctuaCommonMenuService.openLeftDrawer();
  }

  openActivityForm(activityType: ActivityType) {
    this.noctuaActivityFormService.setActivityType(activityType);
    this.noctuaCommonMenuService.selectLeftPanel(LeftPanel.activityForm);
    this.noctuaCommonMenuService.closeRightDrawer();
    this.noctuaCommonMenuService.openLeftDrawer();
  }

  openCopyModel() {
    this.noctuaCommonMenuService.selectLeftPanel(LeftPanel.copyModel);
    this.noctuaCommonMenuService.closeRightDrawer();
    this.noctuaCommonMenuService.openLeftDrawer();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
