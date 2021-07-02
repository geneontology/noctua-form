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
  NoctuaFormMenuService,
  NoctuaActivityFormService,
  CamService,
  noctuaFormConfig,
  MiddlePanel,
  LeftPanel,
  Activity,
  NoctuaGraphService,
  ActivityDisplayType
} from 'noctua-form-base';

import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { NoctuaDataService } from '@noctua.common/services/noctua-data.service';
import { TableOptions } from '@noctua.common/models/table-options';

@Component({
  selector: 'app-noctua-form',
  templateUrl: './noctua-form.component.html',
  styleUrls: ['./noctua-form.component.scss'],
  //encapsulation: ViewEncapsulation.None,
  animations: noctuaAnimations
})
export class NoctuaFormComponent implements OnInit, OnDestroy {
  ActivityType = ActivityType;
  LeftPanel = LeftPanel;
  MiddlePanel = MiddlePanel;


  @ViewChild('leftDrawer', { static: true })
  leftDrawer: MatDrawer;

  @ViewChild('rightDrawer', { static: true })
  rightDrawer: MatDrawer;

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
    private _noctuaGraphService: NoctuaGraphService,
    private noctuaDataService: NoctuaDataService,
    public noctuaUserService: NoctuaUserService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaActivityFormService: NoctuaActivityFormService,
    public noctuaFormMenuService: NoctuaFormMenuService) {

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
    const self = this;

    self.noctuaFormMenuService.setLeftDrawer(self.leftDrawer);
    self.noctuaFormMenuService.setRightDrawer(self.rightDrawer);

    this._noctuaGraphService.onCamGraphChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cam: Cam) => {
        if (!cam || cam.id !== self.cam.id) {
          return;
        }
        this.cam = cam;
      });
  }

  loadCam(modelId) {
    this.cam = this.camService.getCam(modelId);
  }

  openCamForm() {
    this.camService.initializeForm(this.cam);
    this.noctuaFormMenuService.openLeftDrawer(LeftPanel.camForm);
  }

  openActivityForm(activityType: ActivityType) {
    this.noctuaActivityFormService.setActivityType(activityType);
    this.noctuaFormMenuService.openLeftDrawer(LeftPanel.activityForm);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}

