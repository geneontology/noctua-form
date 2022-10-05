import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import {
  Cam,
  NoctuaFormConfigService,
  CamService,
  ActivityType,
  NoctuaActivityFormService
} from '@geneontology/noctua-form-base';

import { NoctuaCommonMenuService } from '@noctua.common/services/noctua-common-menu.service';
import { LeftPanel, MiddlePanel, RightPanel } from '@noctua.common/models/menu-panels';
import { WorkbenchId } from '@noctua.common/models/workench-id';
import { CamToolbarOptions } from '@noctua.common/models/cam-toolbar-options';

@Component({
  selector: 'noc-cam-toolbar',
  templateUrl: './cam-toolbar.component.html',
  styleUrls: ['./cam-toolbar.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class CamToolbarComponent implements OnInit, OnDestroy {

  ActivityType = ActivityType
  LeftPanel = LeftPanel;
  MiddlePanel = MiddlePanel;
  RightPanel = RightPanel;

  @Input('cam') public cam: Cam;
  @Input('options') public camToolbarOptions: CamToolbarOptions;


  private _unsubscribeAll: Subject<any>;

  constructor(
    private camService: CamService,

    public noctuaActivityFormService: NoctuaActivityFormService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaCommonMenuService: NoctuaCommonMenuService,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
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
