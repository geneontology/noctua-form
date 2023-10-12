import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject } from 'rxjs';

import { noctuaAnimations } from './../../../../@noctua/animations';

import {
  Cam,
  ActivityType,
  Contributor,
  NoctuaUserService,
  NoctuaFormConfigService,
  NoctuaAnnotationFormService,
  CamService,

  noctuaFormConfig,
  MiddlePanel,
  LeftPanel,
  Activity,
  BbopGraphService,
  ActivityDisplayType,
  CamLoadingIndicator,
  ReloadType,
  RightPanel
} from '@geneontology/noctua-form-base';

import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { NoctuaDataService } from '@noctua.common/services/noctua-data.service';
import { TableOptions } from '@noctua.common/models/table-options';
import { NoctuaSearchDialogService } from '@noctua.search/services/dialog.service';
import { NoctuaReviewSearchService } from '@noctua.search/services/noctua-review-search.service';
import { ResizeEvent } from 'angular-resizable-element';
import { NoctuaCommonMenuService } from '@noctua.common/services/noctua-common-menu.service';
import { CamToolbarOptions } from '@noctua.common/models/cam-toolbar-options';

@Component({
  selector: 'app-noctua-annotations',
  templateUrl: './noctua-annotations.component.html',
  styleUrls: ['./noctua-annotations.component.scss'],
  //encapsulation: ViewEncapsulation.None,
  animations: noctuaAnimations
})
export class NoctuaAnnotationsComponent implements OnInit, OnDestroy {
  ActivityType = ActivityType;
  LeftPanel = LeftPanel;
  MiddlePanel = MiddlePanel;
  RightPanel = RightPanel;


  @ViewChild('leftDrawer', { static: true })
  leftDrawer: MatDrawer;

  @ViewChild('rightDrawer', { static: true })
  rightDrawer: MatDrawer;

  camToolbarOptions: CamToolbarOptions = {
    showCreateButton: false
  }

  summary;
  public cam: Cam;
  searchResults = [];
  modelId = '';
  resizeStyle = {};

  noctuaFormConfig = noctuaFormConfig;

  tableOptions: TableOptions = {
    displayType: ActivityDisplayType.TREE,
    slimViewer: false,
    editableTerms: true,
    editableEvidence: true,
    editableReference: true,
    editableWith: true,
    editableRelation: true,
    showMenu: true
  };

  private _unsubscribeAll: Subject<any>;

  constructor(
    private route: ActivatedRoute,
    private camService: CamService,
    private _bbopGraphService: BbopGraphService,
    private noctuaDataService: NoctuaDataService,
    private noctuaReviewSearchService: NoctuaReviewSearchService,
    public noctuaSearchDialogService: NoctuaSearchDialogService,
    public noctuaUserService: NoctuaUserService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaAnnotationFormService: NoctuaAnnotationFormService,
    public noctuaCommonMenuService: NoctuaCommonMenuService) {

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

        if (user === undefined) return;

        this.noctuaFormConfigService.setupUrls();
        this.noctuaFormConfigService.setUniversalUrls();
        this.loadCam(this.modelId);
      });
  }

  ngOnInit(): void {
    const self = this;
    this.noctuaCommonMenuService.selectedMiddlePanel = MiddlePanel.camTable;
    self.noctuaCommonMenuService.setLeftDrawer(self.leftDrawer);
    self.noctuaCommonMenuService.setRightDrawer(self.rightDrawer);

    this._bbopGraphService.onCamGraphChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cam: Cam) => {
        if (!cam || cam.id !== self.cam.id) {
          return;
        }
        this.cam = cam;

        if (cam.activities.length > 0) {
          this.camService.addCamEdit(this.cam)
          this.camService.cams = [cam]
        }
        //this.noctuaReviewSearchService.addCamsToReview([this.cam], this.camService.cams);

      });


  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  loadCam(modelId) {
    this.cam = this.camService.getCam(modelId);
  }

  openSearch() {
    this.noctuaCommonMenuService.selectLeftPanel(LeftPanel.findReplace);
    this.noctuaCommonMenuService.closeRightDrawer();
    this.noctuaCommonMenuService.openLeftDrawer();
  }

  openTermsSummary() {
    this.noctuaCommonMenuService.selectLeftPanel(LeftPanel.camTermsSummary);
    this.noctuaCommonMenuService.closeRightDrawer();
    this.noctuaCommonMenuService.openLeftDrawer();
  }

  openCamStats() {
    this.noctuaCommonMenuService.selectLeftPanel(LeftPanel.camStats);
    this.noctuaCommonMenuService.closeRightDrawer();
    this.noctuaCommonMenuService.openLeftDrawer();
  }

  openCamForm() {
    this.camService.initializeForm(this.cam);
    this.noctuaCommonMenuService.selectLeftPanel(LeftPanel.camForm);
    this.noctuaCommonMenuService.closeRightDrawer();
    this.noctuaCommonMenuService.openLeftDrawer();
  }

  openAnnotationForm(activityType: ActivityType) {
    this.noctuaAnnotationFormService.setActivityType(activityType);
    this.noctuaCommonMenuService.selectLeftPanel(LeftPanel.activityForm);
    this.noctuaCommonMenuService.closeRightDrawer();
    this.noctuaCommonMenuService.openLeftDrawer();
  }

  openCopyModel() {
    this.noctuaCommonMenuService.selectLeftPanel(LeftPanel.copyModel);
    this.noctuaCommonMenuService.closeRightDrawer();
    this.noctuaCommonMenuService.openLeftDrawer();
  }

  resetCam(cam: Cam) {
    const self = this;

    const summary = self.camService.reviewCamChanges(cam);
    const success = (ok) => {
      if (ok) {
        cam.loading = new CamLoadingIndicator(true, 'Resetting Model ...');
        self.camService.reloadCam(cam, ReloadType.RESET)
        self.noctuaReviewSearchService.onClearForm.next(true);
        self.noctuaReviewSearchService.clear();
        self.cam.clearHighlight()
      }
    }

    const options = {
      title: 'Discard Unsaved Changes',
      message: `All your changes will be discarded for model. Model Name:"${cam.title}"`,
      cancelLabel: 'Cancel',
      confirmLabel: 'OK'
    }

    self.noctuaSearchDialogService.openCamReviewChangesDialog(success, summary, options)
  }

  storeCam(cam: Cam) {

    const self = this;
    const summary = self.camService.reviewCamChanges(cam);

    const success = (replace) => {
      if (replace) {
        cam.loading = new CamLoadingIndicator(true, 'Saving Model ...');
        self.camService.reloadCam(cam, ReloadType.STORE)
        self.noctuaReviewSearchService.onClearForm.next(true);
        self.noctuaReviewSearchService.clear();
        self.cam.clearHighlight()
      }
    };

    const options = {
      title: 'Save Changes?',
      message: `All your changes will be saved for model. Model Name:"${cam.title}"`,
      cancelLabel: 'Go Back',
      confirmLabel: 'Submit'
    }

    self.noctuaSearchDialogService.openCamReviewChangesDialog(success, summary, options)
  }
}

