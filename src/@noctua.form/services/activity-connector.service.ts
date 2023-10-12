
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NoctuaFormConfigService } from './config/noctua-form-config.service';
import { NoctuaLookupService } from './lookup.service';
import { CamService } from './cam.service';
import { BbopGraphService } from './bbop-graph.service';
import { ActivityConnectorForm } from './../models/forms/activity-connector-form';
import { ActivityFormMetadata } from './../models/forms/activity-form-metadata';
import { Activity } from './../models/activity/activity';
import { ActivityNode } from './../models/activity/activity-node';
import { Cam, CamOperation } from './../models/activity/cam';
import { ConnectorActivity, ConnectorState, ConnectorType } from './../models/activity/connector-activity';
import { Entity } from '../models/activity/entity';
import { noctuaFormConfig } from '../noctua-form-config';
import { Triple } from '../models/activity/triple';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class NoctuaActivityConnectorService {

  cam: Cam;
  public subjectActivity: Activity;
  public objectActivity: Activity;

  public causalConnection: Triple<Activity>;
  public connectors: any = [];
  private connectorForm: ActivityConnectorForm;
  private connectorFormGroup: BehaviorSubject<FormGroup | undefined>;
  public connectorFormGroup$: Observable<FormGroup>;
  public currentConnectorActivity: ConnectorActivity;
  public connectorActivity: ConnectorActivity;
  public onActivityChanged: BehaviorSubject<any>;
  public onLinkChanged: BehaviorSubject<any>;

  private _allowRequestWatch = false;

  constructor(private _fb: FormBuilder, public noctuaFormConfigService: NoctuaFormConfigService,
    private camService: CamService,
    private noctuaLookupService: NoctuaLookupService,
    private bbopGraphService: BbopGraphService) {

    this.onActivityChanged = new BehaviorSubject(null);
    this.onLinkChanged = new BehaviorSubject(null);
    this.connectorFormGroup = new BehaviorSubject(null);
    this.connectorFormGroup$ = this.connectorFormGroup.asObservable();

    this.camService.onCamChanged.subscribe((cam) => {
      if (!cam) {
        return;
      }

      this.cam = cam;

    });
  }

  initializeForm(subjectId: string, objectId: string) {
    const self = this;

    self._allowRequestWatch = false;

    self.subjectActivity = this.cam.findActivityById(subjectId);
    self.objectActivity = this.cam.findActivityById(objectId);
    self.causalConnection = self.cam.getCausalRelation(subjectId, objectId);

    if (this.causalConnection) {
      const predicate = cloneDeep(this.causalConnection.predicate)
      self.connectorActivity = new ConnectorActivity(self.subjectActivity, self.objectActivity, predicate);
      self.connectorActivity.state = ConnectorState.editing
      self.currentConnectorActivity = cloneDeep(this.connectorActivity)
    } else {
      const predicate = self.noctuaFormConfigService.createPredicate(Entity.createEntity(noctuaFormConfig.edge.positivelyRegulates))
      self.connectorActivity = new ConnectorActivity(self.subjectActivity, self.objectActivity, predicate);
      self.connectorActivity.state = ConnectorState.creation
      self.connectorActivity.addDefaultEvidence();
    }

    this.connectorForm = this.createConnectorForm();
    this.connectorFormGroup.next(this._fb.group(this.connectorForm));

    if (this.connectorActivity.connectorType === ConnectorType.ACTIVITY_ACTIVITY) {
      this.connectorForm.relationship.setValue(this.connectorActivity.rule.relationship);
      this.connectorForm.effectDirection.setValue(this.connectorActivity.rule.effectDirection);
      this.connectorForm.directness.setValue(this.connectorActivity.rule.directness);
    } else if (this.connectorActivity.connectorType === ConnectorType.ACTIVITY_MOLECULE) {
      this.connectorForm.relationship.setValue(this.connectorActivity.rule.relationship);
    } else if (this.connectorActivity.connectorType === ConnectorType.MOLECULE_ACTIVITY) {
      this.connectorForm.relationship.setValue(this.connectorActivity.rule.relationship);
      this.connectorForm.effectDirection.setValue(this.connectorActivity.rule.effectDirection);
    }

    this._onActivityFormChanges();

    // just to trigger the on Changes event
    this.connectorForm.effectDirection.setValue(this.connectorActivity.rule.effectDirection);
  }

  updateEvidence(node: ActivityNode) {
    this.connectorForm.updateEvidenceForms(node.predicate);
    this.connectorFormGroup.next(this._fb.group(this.connectorForm));
  }

  createConnectorForm() {
    const self = this;
    const formMetadata = new ActivityFormMetadata(self.noctuaLookupService.lookupFunc.bind(self.noctuaLookupService));
    const connectorForm = new ActivityConnectorForm(formMetadata);

    connectorForm.createEntityForms(self.connectorActivity.predicate);

    return connectorForm;
  }

  saveActivity() {
    const self = this;

    if (self.connectorActivity.state === ConnectorState.editing) {
      const saveData = self.connectorActivity.createEdit(self.currentConnectorActivity);
      return self.bbopGraphService.editConnection(
        self.cam,
        saveData.removeTriples,
        saveData.addTriples).then(() => {
          this.initializeForm(self.subjectActivity.id, self.objectActivity.id)
        });
    } else { // creation
      const saveData = self.connectorActivity.createSave();
      return self.bbopGraphService.addActivity(self.cam, [], saveData.triples, '', CamOperation.ADD_CAUSAL_RELATION);
    }
  }

  deleteConnectorEdge(connectorActivity: ConnectorActivity) {
    const self = this;
    const deleteData = connectorActivity.createDelete();

    return self.bbopGraphService.deleteActivity(self.cam, [], deleteData.triples);
  }


  private _onActivityFormChanges(): void {
    this.connectorFormGroup.getValue().valueChanges.subscribe(value => {
      this.connectorActivity.checkConnection(value);
      if (this.connectorActivity.predicate?.edge?.id && this._allowRequestWatch && (this.connectorActivity.state === ConnectorState.editing)) {
        this.saveActivity()
      }
      this._allowRequestWatch = true
    });
  }
}

