import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { Subscription, Subject } from 'rxjs';

import {
  Activity,
  ConnectorActivity,
  ConnectorState,
  ActivityNode,
  NoctuaActivityConnectorService,
  NoctuaActivityFormService,
  NoctuaFormConfigService,
  NoctuaUserService,
  ConnectorType
} from '@geneontology/noctua-form-base';
import { NoctuaFormDialogService } from '../../../services/dialog.service';
import { NoctuaConfirmDialogService } from '@noctua/components/confirm-dialog/confirm-dialog.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'noc-activity-connector',
  templateUrl: './activity-connector-form.component.html',
  styleUrls: ['./activity-connector-form.component.scss']
})
export class ActivityConnectorFormComponent implements OnInit, OnDestroy {
  ConnectorType = ConnectorType

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
  relationshipOptions;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private confirmDialogService: NoctuaConfirmDialogService,
    public noctuaActivityConnectorService: NoctuaActivityConnectorService,
    public noctuaUserService: NoctuaUserService,
    private noctuaFormDialogService: NoctuaFormDialogService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaActivityFormService: NoctuaActivityFormService,
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
        this.relationshipOptions = this.noctuaFormConfigService[this.connectorActivity.connectorType + 'Relationship']['options']

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
      self.noctuaActivityConnectorService.deleteConnectorEdge(this.connectorActivity).then(() => {
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
