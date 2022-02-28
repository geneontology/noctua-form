
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import { noctuaAnimations } from './../../../../../../@noctua/animations';


import { NoctuaFormDialogService } from './../../services/dialog.service';

import {
  noctuaFormConfig,
  NoctuaActivityConnectorService,
  NoctuaFormConfigService,
  NoctuaActivityFormService,
  CamService,
  Cam,
  Activity,
  NoctuaFormMenuService
} from '@geneontology/noctua-form-base';
import { NoctuaConfirmDialogService } from '@noctua/components/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'noc-cam-preview',
  templateUrl: './cam-preview.component.html',
  styleUrls: ['./cam-preview.component.scss'],
  animations: noctuaAnimations
})
export class CamPreviewComponent implements OnInit, OnDestroy {

  searchCriteria: any = {};
  searchFormData: any = [];
  searchForm: FormGroup;

  @Input('cam')
  public cam: Cam;

  modelId: string = '';

  private unsubscribeAll: Subject<any>;

  constructor(public camService: CamService,
    public noctuaFormMenuService: NoctuaFormMenuService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private confirmDialogService: NoctuaConfirmDialogService,
    private noctuaActivityConnectorService: NoctuaActivityConnectorService,
    public noctuaActivityFormService: NoctuaActivityFormService,
    private noctuaFormDialogService: NoctuaFormDialogService,
  ) {

    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

  }

  addActivity() {
    this.openForm(location);
  }

  openForm(location?) {
    this.noctuaActivityFormService.mfLocation = location;
    this.noctuaActivityFormService.initializeForm();
    // this.noctuaFormMenuService.openRightDrawer(this.noctuaFormMenuService.panel.activityForm);
  }

  openActivityConnector(activity: Activity) {
    this.camService.onCamChanged.next(this.cam);
    this.camService.activity = activity;
    this.noctuaActivityConnectorService.subjectActivity = activity;
    this.noctuaActivityConnectorService.onActivityChanged.next(activity);
    // this.noctuaFormMenuService.openRightDrawer(this.noctuaFormMenuService.panel.connectorForm);
  }

  openActivityForm(activity: Activity) {
    this.camService.onCamChanged.next(this.cam);
    this.camService.activity = activity;
    this.noctuaActivityFormService.initializeForm(activity);
    //  this.noctuaFormMenuService.openRightDrawer(this.noctuaFormMenuService.panel.activityForm);
  }

  deleteActivity(activity: Activity) {
    const self = this;

    const success = () => {
      this.camService.deleteActivity(activity).then(() => {
        self.noctuaFormDialogService.openInfoToast('Activity successfully deleted.', 'OK');
      });
    };

    this.confirmDialogService.openConfirmDialog('Confirm Delete?',
      'You are about to delete an activity.',
      success);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
