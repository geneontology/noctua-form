import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NoctuaFormConfigService } from './config/noctua-form-config.service';
import { NoctuaLookupService } from './lookup.service';
import { Activity, ActivityState, ActivityType } from './../models/activity/activity';
import { ActivityNode } from './../models/activity/activity-node';
import { ActivityForm } from './../models/forms/activity-form';
import { ActivityFormMetadata } from './../models/forms/activity-form-metadata';
import { BbopGraphService } from './bbop-graph.service';
import { CamService } from './cam.service';
import { Entity } from '../models/activity/entity';
import { Evidence } from '../models/activity/evidence';
import { cloneDeep, each } from 'lodash';
import { Cam } from '../models/activity/cam';
import { Triple } from '../models//activity/triple';

@Injectable({
  providedIn: 'root'
})
export class NoctuaActivityFormService {
  public state: ActivityState;
  public mfLocation;
  public errors = [];
  public currentActivity: Activity;
  public activity: Activity;
  public onActivityCreated: BehaviorSubject<Activity>
  public onActivityChanged: BehaviorSubject<Activity>
  public activityForm: ActivityForm;
  public activityFormGroup: BehaviorSubject<FormGroup | undefined>;
  public activityFormGroup$: Observable<FormGroup>;
  public cam: Cam;

  constructor(private _fb: FormBuilder, public noctuaFormConfigService: NoctuaFormConfigService,
    private camService: CamService,
    private bbopGraphService: BbopGraphService,
    private noctuaLookupService: NoctuaLookupService) {

    this.camService.onCamChanged.subscribe((cam) => {
      if (!cam) {
        return;
      }

      this.cam = cam;
    });
    this.activity = this.noctuaFormConfigService.createActivityModel(ActivityType.default);
    this.onActivityCreated = new BehaviorSubject(null);
    this.onActivityChanged = new BehaviorSubject(null);
    this.activityFormGroup = new BehaviorSubject(null);
    this.activityFormGroup$ = this.activityFormGroup.asObservable();

    this.initializeForm();
  }

  initializeForm(rootTypes?) {
    const self = this;

    self.errors = [];

    self.state = ActivityState.creation;
    self.currentActivity = null;

    self.activity.resetPresentation();
    self.activityForm = this.createActivityForm();
    self.activityFormGroup.next(this._fb.group(this.activityForm));
    self.activity.updateShapeMenuShex(rootTypes);
    self.activity.enableSubmit();
    self._onActivityFormChanges();
  }

  initializeFormData() {
    this.fakester(this.activity);
    this.initializeForm();
  }

  createActivityForm() {
    const self = this;
    const formMetadata = new ActivityFormMetadata(self.noctuaLookupService.lookupFunc.bind(self.noctuaLookupService));

    const activityForm = new ActivityForm(formMetadata);

    activityForm.createFunctionDescriptionForm(self.activity.presentation.fd);
    activityForm.createMolecularEntityForm(self.activity.presentation.gp);

    return activityForm;
  }

  activityFormToActivity() {
    this.activityForm.populateActivity(this.activity);
  }

  private _onActivityFormChanges(): void {
    this.activityFormGroup.getValue().valueChanges.subscribe(() => {
      this.activityFormToActivity();
      this.activity.enableSubmit();
    });
  }

  getActivityFormErrors() {
    let errors = [];

    this.activityForm.getErrors(errors);

    return errors;
  }

  setActivityType(activityType: ActivityType) {
    this.activity = this.noctuaFormConfigService.createActivityModel(activityType);
    this.initializeForm();
  }

  linkFormNode(entity, srcNode) {
    entity.uuid = srcNode.uuid;
    entity.term = srcNode.getTerm();
  }

  cloneForm(srcActivity, filterNodes) {
    this.activity = this.noctuaFormConfigService.createActivityModel(
      srcActivity.activityType
    );

    if (filterNodes) {
      each(filterNodes, function (srcNode) {

        let destNode = this.activity.getNode(srcNode.id);
        if (destNode) {
          destNode.copyValues(srcNode);
        }
      });
    } else {
      // this.activity.copyValues(srcActivity);
    }

    this.initializeForm();
  }

  saveActivity() {
    const self = this;
    self.activityFormToActivity();

    if (this.activity.activityType === ActivityType.ccOnly) {
      const promises = []
      const activities = self.createCCAnnotations(self.activity);
      each(activities, (activity: Activity) => {
        const saveData = activity.createSave();
        promises.push(self.bbopGraphService.addActivity(self.cam, saveData.nodes, saveData.triples, saveData.title))
      })

      return forkJoin(promises)

    } else {
      const saveData = self.activity.createSave();
      return forkJoin(self.bbopGraphService.addActivity(self.cam, saveData.nodes, saveData.triples, saveData.title));
    }
  }

  createCCAnnotations(srcActivity: Activity) {
    const self = this;
    const ccEdges: Triple<ActivityNode>[] = srcActivity.getEdges(srcActivity.rootNode.id);
    const activities = []

    each(ccEdges, (ccEdge: Triple<ActivityNode>) => {
      const activity = new Activity();
      const subject = cloneDeep(ccEdge.subject)
      const object = cloneDeep(ccEdge.object)
      const predicate = cloneDeep(ccEdge.predicate)
      activity.activityType = srcActivity.activityType

      activity.addNode(subject);
      activity.addNodes(object);
      activity.addEdge(subject, object, predicate);

      self._createCCAnnotationsDFS(srcActivity, activity, object)

      activities.push(activity)
    });

    return activities;
  }

  private _createCCAnnotationsDFS(srcActivity: Activity, destActivity: Activity, subjectNode: ActivityNode) {
    const self = this;
    const ccEdges: Triple<ActivityNode>[] = srcActivity.getEdges(subjectNode.id);
    each(ccEdges, (ccEdge: Triple<ActivityNode>) => {
      const object = cloneDeep(ccEdge.object)
      const predicate = cloneDeep(ccEdge.predicate)

      destActivity.addNodes(object);
      destActivity.addEdge(subjectNode, object, predicate);

      self._createCCAnnotationsDFS(srcActivity, destActivity, object)
    });
  }

  clearForm() {
    this.activity = this.noctuaFormConfigService.createActivityModel(
      this.activity.activityType
    );

    this.initializeForm();
  }


  fakester(activity: Activity) {
    const self = this;

    each(activity.nodes, (node: ActivityNode) => {
      self.noctuaLookupService.termLookup('a', Object.assign({}, node.termLookup.requestParams, { rows: 100 })).subscribe(response => {
        if (response && response.length > 0) {
          const termsCount = response.length;
          node.term = Entity.createEntity(response[Math.floor(Math.random() * termsCount)]);

          each(node.predicate.evidence, (evidence: Evidence) => {
            self.noctuaLookupService.termLookup('a', Object.assign({}, node.predicate.evidenceLookup.requestParams, { rows: 100 })).subscribe(response => {
              if (response && response.length > 0) {
                const evidenceCount = response.length;
                evidence.evidence = Entity.createEntity(response[Math.floor(Math.random() * evidenceCount)]);
                evidence.reference = `PMID:${Math.floor(Math.random() * 1000000) + 1000}`;
              }
            });
          });
        }
      });
    });
  }

}
