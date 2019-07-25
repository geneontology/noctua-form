

import { Component, Inject, Input, OnInit, ElementRef, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatDrawer } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, Subscription, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';


import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

import { noctuaAnimations } from './../../../../../../../@noctua/animations';


import { NoctuaFormService } from '../../../services/noctua-form.service';


import { NoctuaSearchService } from './../../../../../../../@noctua.search/services/noctua-search.service';
import { CamDiagramService } from './../../cam-diagram/services/cam-diagram.service';
import { CamTableService } from './../../cam-table/services/cam-table.service';

import { SparqlService } from './../../../../../../../@noctua.sparql/services/sparql/sparql.service';

import {
  Cam,
  Annoton,
  ConnectorAnnoton,
  ConnectorState,
  ConnectorType,
  AnnotonNode,
  Evidence,
  NoctuaAnnotonConnectorService,

  NoctuaGraphService,
  NoctuaAnnotonFormService,
  NoctuaFormConfigService,
  NoctuaLookupService,
  CamService,
  noctuaFormConfig,
  Entity
} from 'noctua-form-base';
import { NoctuaFormDialogService } from '../../../services/dialog.service';

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
  panel = {
    selectConnector: {
      id: 1
    }, annotonConnectorForm: {
      id: 2
    },
  };
  selectedPanel: any;
  annoton: Annoton;
  currentConnectorAnnoton: ConnectorAnnoton;
  connectorAnnoton: ConnectorAnnoton;
  mfNode: AnnotonNode;

  cam: Cam;
  connectorFormGroup: FormGroup;
  connectorFormSub: Subscription;

  searchCriteria: any = {};
  evidenceFormArray: FormArray;
  // annoton: Annoton = new Annoton();

  selectedCausalEffect;

  private unsubscribeAll: Subject<any>;


  constructor(private route: ActivatedRoute,
    private camService: CamService,
    private formBuilder: FormBuilder,
    public noctuaAnnotonConnectorService: NoctuaAnnotonConnectorService,
    private noctuaSearchService: NoctuaSearchService,
    private camDiagramService: CamDiagramService,
    public camTableService: CamTableService,
    private noctuaGraphService: NoctuaGraphService,
    private noctuaFormDialogService: NoctuaFormDialogService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaAnnotonFormService: NoctuaAnnotonFormService,
    private noctuaLookupService: NoctuaLookupService,
    public noctuaFormService: NoctuaFormService,
    private sparqlService: SparqlService
  ) {
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.connectorFormSub = this.noctuaAnnotonConnectorService.connectorFormGroup$
      .subscribe(connectorFormGroup => {
        if (!connectorFormGroup) return;
        this.connectorFormGroup = connectorFormGroup;
        this.currentConnectorAnnoton = this.noctuaAnnotonConnectorService.currentConnectorAnnoton;
        this.connectorAnnoton = this.noctuaAnnotonConnectorService.connectorAnnoton;

        this.selectedCausalEffect = this.connectorFormGroup.get('causalEffect').value

        console.log(this.selectedCausalEffect)
      });

    this.camService.onCamChanged.subscribe((cam) => {
      if (!cam) return;

      this.cam = cam
    });

    this.noctuaAnnotonConnectorService.onAnnotonChanged.subscribe((annoton) => {
      this.annoton = annoton;
      this.selectPanel(this.panel.selectConnector);
    });

    this.selectPanel(this.panel.selectConnector);
  }

  selectPanel(panel) {
    this.selectedPanel = panel;
  }

  openAnnotonConnector(connector: Annoton) {
    this.noctuaAnnotonConnectorService.initializeForm(this.noctuaAnnotonConnectorService.annoton.connectionId, connector.connectionId);
    this.selectPanel(this.panel.annotonConnectorForm);
  }


  save() {
    const self = this;
    this.noctuaAnnotonConnectorService.save().then(() => {
      self.selectPanel(self.panel.selectConnector);
      self.noctuaAnnotonConnectorService.getConnections();
      self.noctuaFormDialogService.openSuccessfulSaveToast('Causal relation successfully created.', 'OK');
    });
  }

  addEvidence() {
    const self = this;

    self.connectorAnnoton.upstreamNode.addEvidence();
    this.noctuaAnnotonConnectorService.updateEvidence(self.connectorAnnoton.upstreamNode);
  }

  removeEvidence(index: number) {
    const self = this;

    self.connectorAnnoton.upstreamNode.removeEvidence(index);
    this.noctuaAnnotonConnectorService.updateEvidence(self.connectorAnnoton.upstreamNode);
  }

  addNDEvidence() {
    const self = this;

    let evidence = new Evidence();
    evidence.setEvidence(new Entity(
      noctuaFormConfig.evidenceAutoPopulate.nd.evidence.id,
      noctuaFormConfig.evidenceAutoPopulate.nd.evidence.label));
    evidence.setReference(new Entity(null, noctuaFormConfig.evidenceAutoPopulate.nd.reference));
    self.connectorAnnoton.upstreamNode.setEvidence([evidence]);
    this.noctuaAnnotonConnectorService.updateEvidence(self.connectorAnnoton.upstreamNode);
  }

  clearValues() {
    const self = this;

    self.connectorAnnoton.upstreamNode.clearValues();
    this.noctuaAnnotonConnectorService.updateEvidence(self.connectorAnnoton.upstreamNode);
  }

  openSelectEvidenceDialog() {
    const self = this;

    let evidences: Evidence[] = this.camService.getUniqueEvidence();

    let success = function (selected) {
      if (selected.evidences && selected.evidences.length > 0) {
        self.connectorAnnoton.upstreamNode.setEvidence(selected.evidences, ['assignedBy']);
        this.noctuaAnnotonConnectorService.updateEvidence(self.connectorAnnoton.upstreamNode);
      }
    }

    self.noctuaFormDialogService.openSelectEvidenceDialog(evidences, success);
  }

  clear() {
    this.noctuaAnnotonFormService.clearForm();
  }

  close() {
    this.panelDrawer.close()
  }

  termDisplayFn(term): string | undefined {
    return term ? term.label : undefined;
  }

  evidenceDisplayFn(evidence): string | undefined {
    return evidence ? evidence.label : undefined;
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
