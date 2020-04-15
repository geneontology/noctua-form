
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import { noctuaAnimations } from './../../../../../../@noctua/animations';


import { NoctuaFormDialogService } from './../../services/dialog.service';

import {
  noctuaFormConfig,
  NoctuaAnnotonConnectorService,
  NoctuaFormConfigService,
  NoctuaAnnotonFormService,
  CamService,
  Cam,
  Annoton,
  NoctuaFormMenuService
} from 'noctua-form-base';
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
  camDisplayType = noctuaFormConfig.camDisplayType.options;

  @Input('cam')
  public cam: Cam;

  modelId: string = '';

  private unsubscribeAll: Subject<any>;

  constructor(public camService: CamService,
    public noctuaFormMenuService: NoctuaFormMenuService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private confirmDialogService: NoctuaConfirmDialogService,
    private noctuaAnnotonConnectorService: NoctuaAnnotonConnectorService,
    public noctuaAnnotonFormService: NoctuaAnnotonFormService,
    private noctuaFormDialogService: NoctuaFormDialogService,
  ) {

    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

  }

  addAnnoton() {
    this.openForm(location);
  }

  openForm(location?) {
    this.noctuaAnnotonFormService.mfLocation = location;
    this.noctuaAnnotonFormService.initializeForm();
    this.noctuaFormMenuService.openRightDrawer(this.noctuaFormMenuService.panel.annotonForm);
  }

  openAnnotonConnector(annoton: Annoton) {
    this.camService.onCamChanged.next(this.cam);
    this.camService.annoton = annoton;
    this.noctuaAnnotonConnectorService.annoton = annoton;
    this.noctuaAnnotonConnectorService.onAnnotonChanged.next(annoton);
    this.noctuaAnnotonConnectorService.getConnections();
    this.noctuaFormMenuService.openRightDrawer(this.noctuaFormMenuService.panel.connectorForm);
  }

  openAnnotonForm(annoton: Annoton) {
    this.camService.onCamChanged.next(this.cam);
    this.camService.annoton = annoton;
    this.noctuaAnnotonFormService.initializeForm(annoton);
    this.noctuaFormMenuService.openRightDrawer(this.noctuaFormMenuService.panel.annotonForm);
  }

  deleteAnnoton(annoton: Annoton) {
    const self = this;

    const success = () => {
      this.camService.deleteAnnoton(annoton).then(() => {
        self.noctuaFormDialogService.openSuccessfulSaveToast('Activity successfully deleted.', 'OK');
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
