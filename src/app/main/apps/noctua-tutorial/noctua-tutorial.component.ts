
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  NoctuaActivityFormService,
  CamService,
  noctuaFormConfig,
  MiddlePanel,
  LeftPanel,
  BbopGraphService,
  ActivityDisplayType
} from '@geneontology/noctua-form-base';

import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { TableOptions } from '@noctua.common/models/table-options';
import { NoctuaSearchDialogService } from '@noctua.search/services/dialog.service';
import { NoctuaReviewSearchService } from '@noctua.search/services/noctua-review-search.service';
import { NoctuaCommonMenuService } from '@noctua.common/services/noctua-common-menu.service';

@Component({
  selector: 'app-noctua-tutorial',
  templateUrl: './noctua-tutorial.component.html',
  styleUrls: ['./noctua-tutorial.component.scss'],
  animations: noctuaAnimations
})
export class NoctuaTutorialComponent implements OnInit, OnDestroy {
  ActivityType = ActivityType;
  LeftPanel = LeftPanel;
  MiddlePanel = MiddlePanel;


  @ViewChild('leftDrawer', { static: true })
  leftDrawer: MatDrawer;

  @ViewChild('rightDrawer', { static: true })
  rightDrawer: MatDrawer;

  summary;
  public cam: Cam;
  searchResults = [];
  modelId = '';

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
    private noctuaReviewSearchService: NoctuaReviewSearchService,
    public noctuaSearchDialogService: NoctuaSearchDialogService,
    public noctuaUserService: NoctuaUserService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaActivityFormService: NoctuaActivityFormService,
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

}


