

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { Subscription, Subject } from 'rxjs';

import {
  Cam,
  Activity,
  ConnectorActivity,
  ConnectorState,
  ActivityNode,
  Evidence,
  NoctuaActivityConnectorService,
  NoctuaActivityFormService,
  NoctuaFormConfigService,
  CamService,
  noctuaFormConfig,
  Entity,
  NoctuaUserService,
  NoctuaFormMenuService,
  ConnectorPanel
} from 'noctua-form-base';
import { NoctuaFormDialogService } from '../../../services/dialog.service';
import { NoctuaConfirmDialogService } from '@noctua/components/confirm-dialog/confirm-dialog.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'noc-activity-connector',
  templateUrl: './activity-connector-form.component.html',
  styleUrls: ['./activity-connector-form.component.scss']
})
export class ActivityConnectorFormComponent implements OnInit, OnDestroy {
  ConnectorPanel = ConnectorPanel;

  @Input('panelDrawer')
  panelDrawer: MatDrawer;

  @Input() public closeDialog: () => void;

  connectorState = ConnectorState;
  currentConnectorActivity: ConnectorActivity;
  connectorActivity: ConnectorActivity;
  mfNode: ActivityNode;
  connectorFormGroup: FormGroup;
  connectorFormSub: Subscription;
  searchCriteria: any = {};
  evidenceFormArray: FormArray;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private camService: CamService,
    private confirmDialogService: NoctuaConfirmDialogService,
    public noctuaActivityConnectorService: NoctuaActivityConnectorService,
    public noctuaUserService: NoctuaUserService,
    private noctuaFormDialogService: NoctuaFormDialogService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaActivityFormService: NoctuaActivityFormService,
    public noctuaFormMenuService: NoctuaFormMenuService,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.connectorFormSub = this.noctuaActivityConnectorService.connectorFormGroup$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(connectorFormGroup => {
        if (!connectorFormGroup) {
          return;
        }
        this.connectorFormGroup = connectorFormGroup;
        this.connectorActivity = this.noctuaActivityConnectorService.connectorActivity;
      });

  }

  openActivityConnector(connector: Activity) {
    this.noctuaActivityConnectorService.initializeForm(this.noctuaActivityConnectorService.objectActivity.id, connector.id);
    this.noctuaActivityConnectorService.selectPanel(ConnectorPanel.FORM);
  }

  save() {
    const self = this;
    this.noctuaActivityConnectorService.saveActivity().then(() => {
      self.noctuaActivityConnectorService.selectPanel(ConnectorPanel.SELECT);
      self.noctuaFormDialogService.openInfoToast('Causal relation successfully created.', 'OK');
      if (this.closeDialog) {
        this.closeDialog();
      }
    });
  }

  editActivity() {
    const self = this;
    const success = () => {
      self.noctuaActivityConnectorService.saveActivity().then(() => {
        self.noctuaActivityConnectorService.selectPanel(ConnectorPanel.SELECT);
        self.noctuaFormDialogService.openInfoToast('Causal relation successfully updated.', 'OK');
      });
    };

    this.confirmDialogService.openConfirmDialog('Confirm Delete?',
      'You are about to remove the causal relation',
      success);
  }

  deleteActivity(connectorActivity: ConnectorActivity) {
    const self = this;
    const success = () => {
      self.noctuaActivityConnectorService.deleteActivity(connectorActivity).then(() => {
        self.noctuaActivityConnectorService.selectPanel(ConnectorPanel.SELECT);
        self.noctuaFormDialogService.openInfoToast('Causal relation successfully deleted.', 'OK');
      });
    };

    this.confirmDialogService.openConfirmDialog('Confirm Delete?',
      'You are about to remove the causal relation',
      success);
  }


  clear() {
    this.noctuaActivityFormService.clearForm();
  }

  close() {
    if (this.panelDrawer) {
      this.panelDrawer.close();
    }
    if (this.closeDialog) {
      this.closeDialog();
    }
  }

  termDisplayFn(term): string | undefined {
    return term && term.id ? `${term.label} (${term.id})` : undefined;
  }

  evidenceDisplayFn(evidence): string | undefined {
    return evidence && evidence.id ? `${evidence.label} (${evidence.id})` : undefined;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
