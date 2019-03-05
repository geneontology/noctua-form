import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { map, finalize, filter, reduce, catchError, retry, tap } from 'rxjs/operators';

import { NoctuaUtils } from '@noctua/utils/noctua-utils';
import { CurieService } from '@noctua.curie/services/curie.service';
import { NoctuaGraphService } from '@noctua.form/services/graph.service';

import { AnnotonNode } from '@noctua.form/models/annoton/annoton-node';
import { NoctuaFormConfigService } from '@noctua.form/services/config/noctua-form-config.service';

//import { Cam } from '../models/cam';
import { CamRow } from '../models/cam-row';
import { Curator } from '../models/curator';
import { Group } from '../models/group';

import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { Cam } from '@noctua.form/models/annoton/cam';
declare const require: any;
const each = require('lodash/forEach');

@Injectable({
  providedIn: 'root'
})
export class CamService {
  baseUrl = environment.spaqrlApiUrl;
  curieUtil: any;
  loading: boolean = false;
  cam: Cam;
  onCamsChanged: BehaviorSubject<any>;
  onCamChanged: BehaviorSubject<any>;

  searchSummary: any = {}

  constructor(public noctuaFormConfigService: NoctuaFormConfigService,
    private httpClient: HttpClient,
    private noctuaGraphService: NoctuaGraphService,
    private curieService: CurieService) {
    this.onCamsChanged = new BehaviorSubject({});
    this.onCamChanged = new BehaviorSubject({});
    this.curieUtil = this.curieService.getCurieUtil();
  }

  getCam(modelId): Cam {
    const self = this;

    let cam: Cam = new Cam();

    cam.id = uuid();
    cam.graph = null;
    cam.model = Object.assign({}, {
      id: modelId,
      title: '',
      modelInfo: this.noctuaFormConfigService.getModelUrls(modelId)
    });
    cam.expanded = true;
    this.noctuaGraphService.getGraphInfo(cam, modelId);
    this.cam = cam;
    this.onCamChanged.next(cam);

    return cam;
  }


  getAnnotonLocation(id): Observable<any> {
    const self = this;

    return this.httpClient
      .get(`${environment.locationStoreApi}?activity_id${id}`)
      .pipe(
        tap(res => {
          console.log(res)
        }),
        finalize(() => {
          //self.loading = false;
        })
      );
  }

  setAnnotonLocation(id, x, y): Observable<any> {
    const self = this;

    const params = new HttpParams()
      .set('activity_id', id)
      .set('x', x)
      .set('y', y);

    return this.httpClient
      .post(environment.locationStoreApi + params.toString(), {})
      .pipe(
        tap(res => {
          console.log(res)
        }),
        finalize(() => {
          //self.loading = false;
        })
      );
  }

  addCamChildren(srcCam, annotons) {
    const self = this;

    srcCam.camRow = [];

    _.each(annotons, function (annoton) {
      let cam = self.annotonToCam(srcCam, annoton);

      cam.model = srcCam.model;
      cam.graph = srcCam.graph;
      srcCam.camRow.push(cam);
    });

    this.onCamsChanged.next(srcCam.camRow);
  }

  annotonToCam(cam, annoton) {

    let destNode = new AnnotonNode()
    destNode.deepCopyValues(annoton.node);

    let result: CamRow = {
      // id: uuid(),
      treeLevel: annoton.treeLevel,
      // model: cam.model,
      annotatedEntity: {
        id: '',
        label: annoton.gp
      },
      relationship: annoton.relationship,
      aspect: annoton.aspect,
      term: annoton.term,
      relationshipExt: annoton.relationshipExt,
      extension: annoton.extension,
      evidence: annoton.evidence,
      reference: annoton.reference,
      with: annoton.with,
      assignedBy: annoton.assignedBy,
      srcNode: annoton.node,
      destNode: destNode
    }

    return result;
  }

  getOrcid(orcid) {
    return "\"" + orcid + "\"^^xsd:string";
  }

}
