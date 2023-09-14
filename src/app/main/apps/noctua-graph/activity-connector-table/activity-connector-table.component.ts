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
  NoctuaActivityConnectorService,
  NoctuaActivityFormService,
  NoctuaFormConfigService,
  NoctuaUserService,
  ConnectorType,
  NoctuaActivityEntityService
} from '@geneontology/noctua-form-base';
import { NoctuaConfirmDialogService } from '@noctua/components/confirm-dialog/confirm-dialog.service';
import { takeUntil } from 'rxjs/operators';
import { TableOptions } from '@noctua.common/models/table-options';
import { SettingsOptions } from '@noctua.common/models/graph-settings';
import { NoctuaCommonMenuService } from '@noctua.common/services/noctua-common-menu.service';
import { NoctuaFormDialogService } from '../../noctua-form/services/dialog.service';

@Component({
  selector: 'noc-activity-connector-table',
  templateUrl: './activity-connector-table.component.html',
  styleUrls: ['./activity-connector-table.component.scss']
})
export class ActivityConnectorTableComponent implements OnInit, OnDestroy {
  ConnectorType = ConnectorType

  @Input('panelDrawer')
  panelDrawer: MatDrawer;

  @Input('cam') cam: Cam
  @Input('activity') activity: Activity

  evidenceOptions: TableOptions = {
    editableEvidence: true,
    editableReference: true,
    editableWith: true,
    showEvidenceMenu: true,
    showAddEvidenceButton: true
  };


  @Input() public closeDialog: () => void;

  settings: SettingsOptions = new SettingsOptions()

  connectorState = ConnectorState;
  currentConnectorActivity: ConnectorActivity;
  connectorActivity: ConnectorActivity;
  mfNode: ActivityNode;
  connectorFormGroup: FormGroup;
  connectorFormSub: Subscription;
  searchCriteria: any = {};
  evidenceFormArray: FormArray;

  private _unsubscribeAll: Subject<any>;
  relationshipOptions: any;

  constructor(
    private confirmDialogService: NoctuaConfirmDialogService,
    public noctuaActivityConnectorService: NoctuaActivityConnectorService,
    public noctuaUserService: NoctuaUserService,
    private noctuaFormDialogService: NoctuaFormDialogService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaActivityFormService: NoctuaActivityFormService,
    private noctuaCommonMenuService: NoctuaCommonMenuService,
    public noctuaActivityEntityService: NoctuaActivityEntityService,
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
        this.currentConnectorActivity = this.noctuaActivityConnectorService.currentConnectorActivity;
        this.connectorActivity = this.noctuaActivityConnectorService.connectorActivity;
        this.relationshipOptions = this.noctuaFormConfigService[this.connectorActivity.connectorType + 'Relationship']['options']

      });

    this.noctuaCommonMenuService.onCamSettingsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((settings: SettingsOptions) => {
        if (!settings) {
          return;
        }
        this.settings = settings;
      });

  }

  openActivityConnector(connector: Activity) {
    this.noctuaActivityConnectorService.initializeForm(this.noctuaActivityConnectorService.objectActivity.id, connector.id);
  }

  save() {
    const self = this;
    this.noctuaActivityConnectorService.saveActivity().then(() => {
      self.noctuaFormDialogService.openInfoToast('Causal relation successfully created.', 'OK');

      this.noctuaActivityConnectorService.initializeForm(
        self.noctuaActivityConnectorService.subjectActivity.id, self.noctuaActivityConnectorService.objectActivity.id)
      if (this.closeDialog) {
        this.closeDialog();
      }
    });
  }

  editActivity() {
    const self = this;
    const success = () => {
      self.noctuaActivityConnectorService.saveActivity().then(() => {
        self.noctuaFormDialogService.openInfoToast('Causal relation successfully updated.', 'OK');
      });
    };

    this.confirmDialogService.openConfirmDialog('Confirm Delete?',
      'You are about to remove the causal relation',
      success);
  }

  deleteConnectorEdge() {
    const self = this;
    const success = () => {
      self.noctuaActivityConnectorService.deleteConnectorEdge(this.currentConnectorActivity).then(() => {
        self.noctuaFormDialogService.openInfoToast('Causal relation successfully deleted.', 'OK');
      });
    };

    this.confirmDialogService.openConfirmDialog('Confirm Delete?',
      'You are about to remove the causal relation',
      success);
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
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
