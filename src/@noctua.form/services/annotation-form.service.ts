import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, forkJoin, Subject, takeUntil } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NoctuaFormConfigService } from './config/noctua-form-config.service';
import { NoctuaLookupService } from './lookup.service';
import { Activity, ActivityState, ActivityType } from './../models/activity/activity';
import { ActivityNode } from './../models/activity/activity-node';
import { ActivityFormMetadata } from './../models/forms/activity-form-metadata';
import { BbopGraphService } from './bbop-graph.service';
import { CamService } from './cam.service';
import { Entity } from '../models/activity/entity';
import { Evidence } from '../models/activity/evidence';
import { cloneDeep, each } from 'lodash';
import { Cam } from '../models/activity/cam';
import { AnnotationForm } from '@noctua.form/models/forms/annotation-form';
import { AnnotationActivity } from '../models/activity/annotation-activity';

@Injectable({
  providedIn: 'root'
})
export class NoctuaAnnotationFormService {
  public state: ActivityState;
  public mfLocation;
  public errors = [];
  public currentActivity: Activity;
  public activity: Activity;
  public annotationActivity: AnnotationActivity;
  public onActivityCreated: BehaviorSubject<Activity>
  public onActivityChanged: BehaviorSubject<Activity>
  public annotationForm: AnnotationForm;
  public annotationFormGroup: BehaviorSubject<FormGroup | undefined>;
  public annotationFormGroup$: Observable<FormGroup>;
  public cam: Cam;

  private destroy$ = new Subject<void>();

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
    this.annotationFormGroup = new BehaviorSubject(null);
    this.annotationFormGroup$ = this.annotationFormGroup.asObservable();

    this.initializeForm();
  }

  initializeForm(rootTypes?) {

    this.errors = [];

    this.state = ActivityState.creation;
    this.currentActivity = null;

    this.activity.resetPresentation();
    this.annotationForm = this.createAnnotationForm();
    this.annotationFormGroup.next(this._fb.group(this.annotationForm));
    this.activity.updateShapeMenuShex(rootTypes);
    this.activity.enableSubmit();
    this.annotationActivity = new AnnotationActivity(this.activity);
    this._onActivityFormChanges();
  }

  initializeFormData() {
    this.fakester(this.activity);
    this.initializeForm();
  }

  createAnnotationForm() {
    const self = this;
    const formMetadata = new ActivityFormMetadata(self.noctuaLookupService.lookupFunc.bind(self.noctuaLookupService));

    const activityForm = new AnnotationForm(formMetadata);

    activityForm.createMolecularEntityForm(self.activity.presentation.gp);

    return activityForm;
  }

  activityFormToActivity() {
    this.annotationForm.populateActivity(this.annotationActivity);
  }

  private _onActivityFormChanges(): void {
    this.annotationFormGroup.getValue().valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value) => {
      this.activityFormToActivity();
      this.activity.enableSubmit();
      this.annotationActivity.updateAspect();

      const edges = this.noctuaFormConfigService.getTermRelations(
        this.annotationActivity.gp.rootTypes,
        this.annotationActivity.goterm.rootTypes,
        true
      );

      const extensionObjects = this.noctuaFormConfigService.getObjectsRelations(
        this.annotationActivity.goterm.rootTypes,
      );

      const extensionEdges = this.noctuaFormConfigService.getTermRelations(
        this.annotationActivity.goterm.rootTypes,
        this.annotationActivity.extension.rootTypes
      );

      this.annotationActivity.gpToTermEdges = edges;
      this.annotationActivity.extensionEdges = extensionEdges;

      if (extensionObjects.length > 0) {
        this.annotationActivity.extension.category = extensionObjects;
        this.noctuaFormConfigService.setTermLookup(this.annotationActivity.extension, extensionObjects);
        // this.annotationForm.
      }

      if (edges.length > 0 && this.annotationActivity.gp.hasValue()
        && this.annotationActivity.goterm.hasValue()) {
        this.destroy$.next();
        this.annotationForm.gpToTermEdge.setValue(edges[0]);
        this.destroy$ = new Subject<void>();
        this._onActivityFormChanges();
      }


      console.log('ext', extensionObjects);
      console.log('edges', extensionEdges);
      console.log(this.annotationActivity);
    });
  }

  getActivityFormErrors() {
    let errors = [];

    this.annotationForm.getErrors(errors);

    return errors;
  }

  setActivityType(activityType: ActivityType) {
    this.activity = this.noctuaFormConfigService.createActivityModel(activityType);
    this.initializeForm();
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

  saveAnnotation() {
    const self = this;
    self.activityFormToActivity();
    self.annotationActivity.activityToAnnotation(self.activity);
    const saveData = self.annotationActivity.createSave();
    return forkJoin(self.bbopGraphService.addActivity(self.cam, saveData.nodes, saveData.triples, saveData.title));
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
