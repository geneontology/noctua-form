

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDrawer } from '@angular/material';
import { Subscription, Subject } from 'rxjs';

import * as _ from 'lodash';
declare const require: any;

import { NoctuaFormService } from '../../../services/noctua-form.service';
import { CamTableService } from './../../cam-table/services/cam-table.service';

import {
  Cam,
  Annoton,
  ConnectorAnnoton,
  ConnectorState,
  ConnectorType,
  AnnotonNode,
  Evidence,
  NoctuaAnnotonConnectorService,
  NoctuaAnnotonFormService,
  NoctuaFormConfigService,
  CamService,
  noctuaFormConfig,
  Entity
} from 'noctua-form-base';
import { NoctuaFormDialogService } from '../../../services/dialog.service';
import { NoctuaConfirmDialogService } from '@noctua/components/confirm-dialog/confirm-dialog.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'noc-annoton-connector',
  templateUrl: './annoton-connector-form.component.html',
  styleUrls: ['./annoton-connector-form.component.scss']
})
export class AnnotonConnectorFormComponent implements OnInit, OnDestroy {

  @Input('panelDrawer')
  panelDrawer: MatDrawer;

  connectorType = ConnectorType;
  connectorState = ConnectorState;
  annoton: Annoton;
  currentConnectorAnnoton: ConnectorAnnoton;
  connectorAnnoton: ConnectorAnnoton;
  mfNode: AnnotonNode;
  cam: Cam;
  connectorFormGroup: FormGroup;
  connectorFormSub: Subscription;
  searchCriteria: any = {};
  evidenceFormArray: FormArray;

  private _unsubscribeAll: Subject<any>;

  constructor(private camService: CamService,
    private confirmDialogService: NoctuaConfirmDialogService,
    public noctuaAnnotonConnectorService: NoctuaAnnotonConnectorService,
    public camTableService: CamTableService,
    private noctuaFormDialogService: NoctuaFormDialogService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaAnnotonFormService: NoctuaAnnotonFormService,
    public noctuaFormService: NoctuaFormService,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.connectorFormSub = this.noctuaAnnotonConnectorService.connectorFormGroup$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(connectorFormGroup => {
        if (!connectorFormGroup) {
          return;
        }
        this.connectorFormGroup = connectorFormGroup;
        this.currentConnectorAnnoton = this.noctuaAnnotonConnectorService.currentConnectorAnnoton;
        this.connectorAnnoton = this.noctuaAnnotonConnectorService.connectorAnnoton;
      });

    this.camService.onCamChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cam) => {
        if (!cam) {
          return;
        }

        this.cam = cam;
      });

    this.noctuaAnnotonConnectorService.onAnnotonChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((annoton) => {
        this.annoton = annoton;
        this.noctuaAnnotonConnectorService.selectPanel(this.noctuaAnnotonConnectorService.panel.selectConnector);
      });

    this.noctuaAnnotonConnectorService.selectPanel(this.noctuaAnnotonConnectorService.panel.selectConnector);
  }

  openAnnotonConnector(connector: Annoton) {
    this.noctuaAnnotonConnectorService.initializeForm(this.noctuaAnnotonConnectorService.annoton.id, connector.id);
    this.noctuaAnnotonConnectorService.selectPanel(this.noctuaAnnotonConnectorService.panel.annotonConnectorForm);
  }

  save() {
    const self = this;
    this.noctuaAnnotonConnectorService.saveAnnoton().then(() => {
      self.noctuaAnnotonConnectorService.selectPanel(self.noctuaAnnotonConnectorService.panel.selectConnector);
      self.noctuaAnnotonConnectorService.getConnections();
      self.noctuaFormDialogService.openSuccessfulSaveToast('Causal relation successfully created.', 'OK');
    });
  }

  editAnnoton() {
    const self = this;
    const success = () => {
      self.noctuaAnnotonConnectorService.saveAnnoton().then(() => {
        self.noctuaAnnotonConnectorService.selectPanel(self.noctuaAnnotonConnectorService.panel.selectConnector);
        self.noctuaAnnotonConnectorService.getConnections();
        self.noctuaFormDialogService.openSuccessfulSaveToast('Causal relation successfully updated.', 'OK');
      });
    };

    this.confirmDialogService.openConfirmDialog('Confirm Delete?',
      'You are about to remove the causal relation',
      success);
  }

  deleteAnnoton(connectorAnnoton: ConnectorAnnoton) {
    const self = this;
    const success = () => {
      self.noctuaAnnotonConnectorService.deleteAnnoton(connectorAnnoton).then(() => {
        self.noctuaAnnotonConnectorService.selectPanel(self.noctuaAnnotonConnectorService.panel.selectConnector);
        self.noctuaAnnotonConnectorService.getConnections();
        self.noctuaFormDialogService.openSuccessfulSaveToast('Causal relation successfully deleted.', 'OK');
      });
    };

    this.confirmDialogService.openConfirmDialog('Confirm Delete?',
      'You are about to remove the causal relation',
      success);
  }

  addEvidence() {
    const self = this;

    self.connectorAnnoton.upstreamNode.predicate.addEvidence();
    this.noctuaAnnotonConnectorService.updateEvidence(self.connectorAnnoton.upstreamNode);
  }

  removeEvidence(index: number) {
    const self = this;

    self.connectorAnnoton.upstreamNode.predicate.removeEvidence(index);
    this.noctuaAnnotonConnectorService.updateEvidence(self.connectorAnnoton.upstreamNode);
  }

  addNDEvidence() {
    const self = this;

    const evidence = new Evidence();
    evidence.setEvidence(new Entity(
      noctuaFormConfig.evidenceAutoPopulate.nd.evidence.id,
      noctuaFormConfig.evidenceAutoPopulate.nd.evidence.label));
    evidence.reference = noctuaFormConfig.evidenceAutoPopulate.nd.reference;
    self.connectorAnnoton.upstreamNode.predicate.setEvidence([evidence]);
    this.noctuaAnnotonConnectorService.updateEvidence(self.connectorAnnoton.upstreamNode);
  }

  clearValues() {
    const self = this;

    self.connectorAnnoton.upstreamNode.clearValues();
    this.noctuaAnnotonConnectorService.updateEvidence(self.connectorAnnoton.upstreamNode);
  }

  openSelectEvidenceDialog() {
    const self = this;

    const evidences: Evidence[] = this.camService.getUniqueEvidence();

    const success = (selected) => {
      if (selected.evidences && selected.evidences.length > 0) {
        self.connectorAnnoton.upstreamNode.predicate.setEvidence(selected.evidences, ['assignedBy']);
        this.noctuaAnnotonConnectorService.updateEvidence(self.connectorAnnoton.upstreamNode);
      }
    };

    self.noctuaFormDialogService.openSelectEvidenceDialog(evidences, success);
  }

  clear() {
    this.noctuaAnnotonFormService.clearForm();
  }

  close() {
    this.panelDrawer.close();
  }

  termDisplayFn(term): string | undefined {
    return term ? term.label : undefined;
  }

  evidenceDisplayFn(evidence): string | undefined {
    return evidence ? evidence.label : undefined;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
