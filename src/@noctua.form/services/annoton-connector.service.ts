
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NoctuaFormConfigService } from './config/noctua-form-config.service';
import { NoctuaLookupService } from './lookup.service';
import { CamService } from './cam.service';
import { NoctuaGraphService } from './graph.service';

import {
  Cam,
  Annoton,
  AnnotonNode,
  ConnectorAnnoton,
  ConnectorState
} from './../models/annoton';

import { AnnotonConnectorForm } from './../models/forms/annoton-connector-form';
import { AnnotonFormMetadata } from './../models/forms/annoton-form-metadata';
import { each } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class NoctuaAnnotonConnectorService {

  cam: Cam;
  public annoton: Annoton;
  public connectors: any = [];
  private connectorForm: AnnotonConnectorForm;
  private connectorFormGroup: BehaviorSubject<FormGroup | undefined>;
  public connectorFormGroup$: Observable<FormGroup>;
  public currentConnectorAnnoton: ConnectorAnnoton;
  public connectorAnnoton: ConnectorAnnoton;
  public onAnnotonChanged: BehaviorSubject<any>;

  panel = {
    selectConnector: {
      id: 1
    }, annotonConnectorForm: {
      id: 2
    },
  };

  selectedPanel: any;
  constructor(private _fb: FormBuilder, public noctuaFormConfigService: NoctuaFormConfigService,
    private camService: CamService,
    private noctuaLookupService: NoctuaLookupService,
    private noctuaGraphService: NoctuaGraphService) {

    this.onAnnotonChanged = new BehaviorSubject(null);
    this.connectorFormGroup = new BehaviorSubject(null);
    this.connectorFormGroup$ = this.connectorFormGroup.asObservable();

    this.camService.onCamChanged.subscribe((cam) => {
      if (!cam) {
        return;
      }

      this.cam = cam;
      if (this.annoton) {
        this.getConnections();
      }
    });
  }

  selectPanel(panel) {
    this.selectedPanel = panel;
  }

  getConnections() {
    const self = this;
    const connectors = [];

    each(this.cam.annotons, (annoton: Annoton) => {
      if (self.annoton.id !== annoton.id) {
        connectors.push(
          Object.assign({
            annoton: annoton,
            connectorAnnoton: this.cam.getConnectorAnnoton(self.annoton.id, annoton.id)
          })
        );
      }
    });

    self.connectors = connectors;
  }

  initializeForm(upstreamId: string, downstreamId: string) {
    const upstreamAnnoton = this.cam.getAnnotonByConnectionId(upstreamId);
    const downstreamAnnoton = this.cam.getAnnotonByConnectionId(downstreamId);

    this.connectorAnnoton = this.noctuaFormConfigService.createAnnotonConnectorModel(upstreamAnnoton, downstreamAnnoton);
    this.currentConnectorAnnoton = this.cam.getConnectorAnnoton(upstreamId, downstreamId);

    if (this.currentConnectorAnnoton) {
      this.currentConnectorAnnoton.setPreview();
      this.connectorAnnoton.copyValues(this.currentConnectorAnnoton);
    }

    this.connectorForm = this.createConnectorForm();
    this.connectorFormGroup.next(this._fb.group(this.connectorForm));
    this.connectorForm.causalEffect.setValue(this.connectorAnnoton.rule.effectDirection.direction);
    this.connectorForm.causalReactionProduct.setValue(this.connectorAnnoton.rule.effectReactionProduct.reaction);
    this.connectorForm.annotonsConsecutive.setValue(this.connectorAnnoton.rule.annotonsConsecutive.condition);
    this.connectorForm.effectDependency.setValue(this.connectorAnnoton.rule.effectDependency.condition);
    this._onAnnotonFormChanges();
    // just to trigger the on Changes event
    this.connectorForm.causalEffect.setValue(this.connectorAnnoton.rule.effectDirection.direction);
    this.selectPanel(this.panel.annotonConnectorForm);
  }

  updateEvidence(node: AnnotonNode) {
    this.connectorForm.updateEvidenceForms(node.predicate);
    this.connectorFormGroup.next(this._fb.group(this.connectorForm));
  }

  createConnectorForm() {
    const self = this;
    const connectorFormMetadata = new AnnotonFormMetadata(self.noctuaLookupService.golrLookup.bind(self.noctuaLookupService));
    const connectorForm = new AnnotonConnectorForm(connectorFormMetadata);

    connectorForm.createEntityForms(self.connectorAnnoton.predicate, self.connectorAnnoton.hasInputNode);
    connectorForm.onValueChanges(self.connectorAnnoton.hasInputNode.termLookup);

    return connectorForm;
  }

  saveAnnoton() {
    const self = this;
    const value = this.connectorFormGroup.getValue().value;
    this.connectorAnnoton.prepareSave(value);

    if (self.connectorAnnoton.state === ConnectorState.editing) {
      const saveData = self.connectorAnnoton.createEdit(self.currentConnectorAnnoton);

      return self.noctuaGraphService.editAnnoton(self.cam,
        saveData.srcNodes,
        saveData.destNodes,
        saveData.srcTriples,
        saveData.destTriples,
        saveData.removeIds,
        saveData.removeTriples);
    } else { // creation
      const saveData = self.connectorAnnoton.createSave();
      return self.noctuaGraphService.saveAnnoton(self.cam, saveData.triples, saveData.title);
    }
  }

  deleteAnnoton(connectorAnnoton: ConnectorAnnoton) {
    const self = this;
    const deleteData = connectorAnnoton.createDelete();

    return self.noctuaGraphService.deleteAnnoton(self.cam, deleteData.uuids, deleteData.triples);
  }

  private _onAnnotonFormChanges(): void {
    this.connectorFormGroup.getValue().valueChanges.subscribe(value => {
      //  this.errors = this.getAnnotonFormErrors();
      this.connectorAnnoton.checkConnection(value);
    });
  }
}

