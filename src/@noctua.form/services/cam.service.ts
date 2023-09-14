import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, EMPTY, forkJoin, from, Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CurieService } from './../../@noctua.curie/services/curie.service';
import { BbopGraphService } from './../services/bbop-graph.service';
import { NoctuaFormConfigService } from './../services/config/noctua-form-config.service';
import { NoctuaLookupService } from './lookup.service';
import { NoctuaUserService } from './user.service';
import { Activity } from './../models/activity/activity';
import { CamForm } from './../models/forms/cam-form';
import { ActivityFormMetadata } from './../models/forms/activity-form-metadata';
import { Evidence, compareEvidence } from './../models/activity/evidence';
import { Cam, CamStats } from './../models/activity/cam';
import { differenceWith, each, find, groupBy, uniqWith } from 'lodash';
import { ActivityNodeType, ActivityNode, compareActivity, Entity, CamLoadingIndicator, CamQueryMatch, ReloadType, TermsSummary } from './../models/activity';
import { compareTerm } from './../models/activity/activity-node';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { finalize, map, mergeMap } from 'rxjs/operators';
import { noctuaFormConfig } from './../noctua-form-config';

declare const require: any;

const model = require('bbop-graph-noctua');

@Injectable({
  providedIn: 'root'
})
export class CamService {
  searchApi = environment.searchApi;
  curieUtil: any;
  cams: Cam[] = [];
  cam: Cam;
  onCamChanged: BehaviorSubject<any>;
  onCamsChanged: BehaviorSubject<any>;
  onCopyModelChanged: BehaviorSubject<any>;
  onCamsCheckoutChanged: BehaviorSubject<any>;
  onSelectedCamChanged: BehaviorSubject<any>;
  onSelectedNodeChanged: BehaviorSubject<any>;
  onSelectedActivityChanged: BehaviorSubject<any>;

  activity: Activity | undefined;
  private camForm: CamForm | undefined;
  private camFormGroup: BehaviorSubject<FormGroup | undefined>;
  camFormGroup$: Observable<FormGroup>;

  currentMatch: Entity = new Entity(null, null);

  constructor(
    public noctuaFormConfigService: NoctuaFormConfigService,
    private zone: NgZone,
    private httpClient: HttpClient,
    private noctuaUserService: NoctuaUserService,
    private _fb: FormBuilder,
    private noctuaLookupService: NoctuaLookupService,
    private _bbopGraphService: BbopGraphService,
    private curieService: CurieService) {

    this.onCamChanged = new BehaviorSubject(null);
    this.camFormGroup = new BehaviorSubject(null);
    this.camFormGroup$ = this.camFormGroup.asObservable();

    this.onCamsChanged = new BehaviorSubject(null);
    this.onCopyModelChanged = new BehaviorSubject(null);
    this.onCamsCheckoutChanged = new BehaviorSubject(null);
    this.onSelectedCamChanged = new BehaviorSubject(null);
    this.onSelectedNodeChanged = new BehaviorSubject(null);
    this.onSelectedActivityChanged = new BehaviorSubject(null);
    this.curieUtil = this.curieService.getCurieUtil();

    this.onSelectedCamChanged.subscribe((uuid: string) => {
      if (uuid) {
        this.currentMatch.modelId = uuid;
      }
    });

    this.onSelectedNodeChanged.subscribe((uuid: string) => {
      if (uuid) {
        this.currentMatch.uuid = uuid;
      }
    });
  }

  initializeForm(cam?: Cam) {
    const self = this;

    if (cam) {
      this.cam = cam;
    }

    self.camForm = this.createCamForm();
    self.camFormGroup.next(this._fb.group(this.camForm));
  }

  createCamForm() {
    const self = this;

    const formMetadata = new ActivityFormMetadata(self.noctuaLookupService.lookupFunc.bind(self.noctuaLookupService));
    const camForm = new CamForm(formMetadata);

    camForm.createCamForm(this.cam, this.noctuaUserService.user);

    return camForm;
  }

  //Gets a new cam
  getCam(modelId): Cam {
    const cam: Cam = new Cam();

    this.cam = cam;

    cam.graph = null;
    cam.id = modelId;
    cam.model = Object.assign({}, {
      id: modelId,
      title: '',
      modelInfo: this.noctuaFormConfigService.getModelUrls(modelId)
    });
    cam.expanded = true;
    this._bbopGraphService.getGraphInfo(cam, modelId);
    cam.manager.get_model(cam.id);
    this.onCamChanged.next(cam);

    return cam;
  }

  reload(cam: Cam) {
    this._bbopGraphService.onCamRebuildChange.next(cam);
  }

  //loads an existing cam
  loadCam(cam: Cam) {
    cam.graph = null;
    cam.modifiedStats = new CamStats();
    cam.rebuildRule.reset();
    cam.model = Object.assign({}, {
      id: cam.id,
      title: '',
      modelInfo: this.noctuaFormConfigService.getModelUrls(cam.id)
    });

    this._bbopGraphService.getGraphInfo(cam, cam.id);
    this.cam = cam;

    cam.manager.get_model(cam.id);
  }

  loadCamMeta(cam: Cam) {
    cam.graph = null;
    cam.modifiedStats = new CamStats();
    cam.model = Object.assign({}, {
      id: cam.id,
      title: '',
      modelInfo: this.noctuaFormConfigService.getModelUrls(cam.id)
    });

    this._bbopGraphService.getGraphInfo(cam, cam.id);
  }

  buildTermsTree(termsSummary: TermsSummary) {
    const allTerms = [
      termsSummary.mf,
      termsSummary.bp,
      termsSummary.cc,
      termsSummary.gp,
      termsSummary.other,
      termsSummary.relations,
      termsSummary.evidences,
      termsSummary.evidenceEcos,
      termsSummary.references,
      termsSummary.withs,
      termsSummary.papers,
      termsSummary.contributors,
      termsSummary.dates
    ]

    const treeNodes = allTerms.map((camSummary) => {
      return {
        id: camSummary.label,
        frequency: camSummary.frequency,
        isCategory: true,
        label: camSummary.label,
        children: camSummary.getSortedNodes()
      }
    })

    return treeNodes
  }

  getStoredModel(cam: Cam): Observable<any> {
    const url = `${this.searchApi}/stored?id=${cam.id}`;

    return this.httpClient.get(url)
  }

  bulkEditCam(cam: Cam): Observable<any> {
    const self = this;
    const promises = [];

    promises.push(self._bbopGraphService.bulkEditActivity(cam));

    return forkJoin(promises);
  }

  deleteActivity(activity: Activity) {
    const self = this;
    const deleteData = activity.createDelete();

    return self._bbopGraphService.deleteActivity(self.cam, deleteData.uuids, deleteData.triples);
  }

  updateTermList(formActivity: Activity, entity: ActivityNode) {
    this.noctuaLookupService.termList = this.getUniqueTerms(formActivity);
    entity.termLookup.results = this.noctuaLookupService.termPreLookup(entity.type);
  }

  updateEvidenceList(formActivity: Activity, entity: ActivityNode) {
    this.noctuaLookupService.evidenceList = this.getUniqueEvidence(formActivity);
    entity.predicate.evidenceLookup.results = this.noctuaLookupService.evidencePreLookup();
  }

  updateReferenceList(formActivity: Activity, entity: ActivityNode) {
    this.noctuaLookupService.evidenceList = this.getUniqueEvidence(formActivity);
    entity.predicate.referenceLookup.results = this.noctuaLookupService.referencePreLookup();
  }

  updateWithList(formActivity: Activity, entity: ActivityNode) {
    this.noctuaLookupService.evidenceList = this.getUniqueEvidence(formActivity);
    entity.predicate.withLookup.results = this.noctuaLookupService.withPreLookup();
  }

  getNodesByType(activityType: ActivityNodeType): any[] {
    return this.cam.getNodesByType(activityType);
  }

  getNodesByTypeFlat(activityType: ActivityNodeType): ActivityNode[] {
    return this.cam.getNodesByTypeFlat(activityType);
  }


  getUniqueTerms(formActivity?: Activity): ActivityNode[] {
    const activityNodes = this.cam.getTerms(formActivity);
    const result = uniqWith(activityNodes, compareTerm);

    return result;
  }

  getUniqueEvidence(formActivity?: Activity): Evidence[] {
    const evidences = this.cam.getEvidences(formActivity);
    const result = uniqWith(evidences, compareEvidence);

    return result;
  }

  copyModel(cam: Cam, title: string, includeEvidence = false) {
    const self = this;

    return self._bbopGraphService.copyModelRaw(cam, title, includeEvidence).subscribe((response) => {
      const cam: Cam = self._bbopGraphService.getMetadata(response['data'])
      self.onCopyModelChanged.next(cam)
    });
  }

  resetModel(cam: Cam) {
    const self = this;

    return self._bbopGraphService.resetModel(cam);
  }

  reviewChangesCam(cam: Cam, stats: CamStats): boolean {
    return cam.reviewCamChanges(stats);
  }

  reviewCamChanges(cam: Cam) {
    const self = this;
    const stats = new CamStats();

    const changes = self.reviewChangesCam(cam, stats);
    if (changes) {
      stats.camsCount++;
    }

    stats.updateTotal();

    const result = {
      stats: stats,
    };

    return result
  }

  populateStoredModel(cam: Cam, storedCam) {
    const self = this;
    const noctua_graph = model.graph;

    cam.storedGraph = new noctua_graph();
    cam.storedGraph.load_data_basic(storedCam);
    cam.storedActivities = self._bbopGraphService.graphToActivities(cam.storedGraph)
    cam.checkStored();
    cam.reviewCamChanges();
  }

  addCamEdit(cam: Cam) {
    const self = this;
    cam.loading.status = true;
    self.getStoredModel(cam).pipe(
      finalize(() => {
        cam.loading.status = false;
      })).subscribe({
        next: (response) => {
          if (!response || !response.storedModel || !response.activeModel) return;

          //self._bbopGraphService.rebuildFromStoredApi(cam, response.activeModel);
          self.populateStoredModel(cam, response.storedModel)
          const summary = self.reviewCamChanges(cam);
          self.onCamsCheckoutChanged.next(summary);
          cam.loading.status = false;
        },
      })
  }


  loadCams() {
    const self = this;

    self.onCamsChanged.next(this.cams);
  }

  updateModel(cams: Cam[], responses) {
    const self = this;

    if (responses && responses.length > 0) {
      responses.forEach(response => {
        const cam: Cam = find(cams, { id: response.data().id });
        if (cam) {
          self._bbopGraphService.rebuild(cam, response);
          cam.checkStored()
        }
      })
    }
  }

  expandMatch(nodeId: string) {
    const self = this;

    each(self.cams, (cam: Cam) => {
      cam.expanded = true;
      const activities = cam.findActivityByNodeUuid(nodeId);

      each(activities, (activity: Activity) => {
        activity.expanded = true;
      });
    });
  }

  getReplaceObject(entities: Entity[], replaceWithTerm: any, category) {
    const self = this;
    const groupedEntities = groupBy(entities, 'modelId') as { string: Entity[] };
    const cams: Cam[] = []
    let replaceWith

    if (category && category.name === noctuaFormConfig.findReplaceCategory.options.reference.name) {
      replaceWith = Evidence.formatReference(replaceWithTerm);
    } else {
      replaceWith = replaceWithTerm?.id;
    }

    each(groupedEntities, (values: Entity[], key) => {
      const cam: Cam = find(this.cams, { id: key });

      if (cam) {
        cam.addPendingChanges(entities, replaceWith, category);
        cams.push(cam)
      }
    });

    self.reviewChangesCams();
    return cams;
  }

  replace(cams: Cam[]) {
    const self = this;

    self.reviewChangesCams();
    return self.bulkEditCams(cams);
  }


  bulkEditActivityNode(cam: Cam, node: ActivityNode): Observable<any> {
    const self = this;
    const promises = [];

    promises.push(self._bbopGraphService.bulkEditActivityNode(cam, node));

    return forkJoin(promises).pipe(
      map(res => self.updateModel([cam], res)),
    );
  }

  bulkEditCams(cams: Cam[]): Observable<any> {
    const self = this;
    const promises = [];

    each(cams, (cam: Cam) => {
      promises.push(self._bbopGraphService.bulkEditActivity(cam));
    });

    return forkJoin(promises).pipe(
      map(res => self.updateModel(cams, res)),
    );;
  }

  storeCams(cams: Cam[]): Observable<any> {
    const self = this;

    return from(cams).pipe(
      mergeMap((cam: Cam) => {
        return self._bbopGraphService.storeCam(cam);
      }));

  }

  bulkStoredModel(cams: Cam[]) {
    const self = this;
    const promises = [];

    each(cams, (cam: Cam) => {
      cam.loading = new CamLoadingIndicator(true, 'Calculating Pending Changes ...');
      promises.push(self.getStoredModel(cam));
    });

    return forkJoin(promises);
  }

  reviewChangesCams() {
    const self = this;
    const stats = new CamStats();

    each(this.cams, (cam: Cam) => {
      const changes = self.reviewChangesCam(cam, stats);
      if (changes) {
        stats.camsCount++;
      }
    });

    stats.updateTotal();

    const result = {
      stats: stats,
    };

    this.onCamsCheckoutChanged.next(result);
  }



  clearHighlight() {
    each(this.cams, (cam: Cam) => {
      return cam.clearHighlight();
    });
  }

  clearCams() {
    this.cams = [];
    this.onCamsChanged.next(this.cams);
  }

  resetCams(cams: Cam[]): Observable<any> {
    const self = this;

    return from(cams).pipe(
      mergeMap((cam: Cam) => {
        return self._bbopGraphService.resetModel(cam);
      }))
  }

  resetMatch() {
    each(this.cams, (cam: Cam) => {
      cam.queryMatch = new CamQueryMatch();
    });
  }

  resetLoading(cams: Cam[], camLoadingIndicator = new CamLoadingIndicator) {
    each(cams, (cam: Cam) => {
      cam.loading = camLoadingIndicator;
    });
  }

  reloadCam(cam: Cam, reloadType: ReloadType) {
    const self = this;

    from([cam]).pipe(
      mergeMap((cam: Cam) => {
        if (reloadType === ReloadType.RESET) {
          cam.loading = new CamLoadingIndicator(true, 'Resetting Model ...');
          return self.resetCams([cam]);
        } else if (reloadType === ReloadType.STORE) {
          cam.loading = new CamLoadingIndicator(true, 'Saving Model ...');
          return self.storeCams([cam]);
        } else {
          return EMPTY;
        }
      }),
      finalize(() => {
        self.resetLoading([cam]);
      })).subscribe({
        next: (response) => {
          if (!response || !response.data()) return;

          //Now stored == Active
          self.populateStoredModel(cam, response.data())

          const summary = self.reviewCamChanges(cam);
          self.onCamsCheckoutChanged.next(summary);
          cam.loading.status = false;
        }
      })
  }

  sortCams() {
    this.cams.sort(this._compareDateReviewAdded);
  }

  applyMatchWeights(cams: any[]) {
    let weight = 1;
    each(cams, (cam: Cam, key) => {
      cam.applyWeights(weight);
    });
  }

  updateDisplayNumber(cams: any[]) {
    each(cams, (cam: Cam, key) => {
      cam.displayNumber = (key + 1).toString();
      cam.updateActivityDisplayNumber();
    });

  }

  private _compareDateReviewAdded(a: Cam, b: Cam): number {
    if (a.dateReviewAdded < b.dateReviewAdded) {
      return 1;
    } else {
      return -1;
    }
  }


}
