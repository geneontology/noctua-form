import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { map, finalize, filter, reduce, catchError, retry, tap } from 'rxjs/operators';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms'

import { CurieService } from './../../@noctua.curie/services/curie.service';
import { NoctuaGraphService } from './../services/graph.service';

import { NoctuaFormConfigService } from './../services/config/noctua-form-config.service';
import { NoctuaLookupService } from './lookup.service';
import { NoctuaUserService } from './user.service';
import { CamRow } from '../models/cam-row';
import { Contributor } from '../models/contributor';
import { Group } from '../models/group';

import { Annoton } from './../models/annoton/annoton';
import { AnnotonNode } from './../models/annoton/annoton-node';

import { CamForm } from './../models/forms/cam-form';
import { AnnotonFormMetadata } from './../models/forms/annoton-form-metadata';

import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { Cam } from './../models/annoton/cam';
declare const require: any;
const each = require('lodash/forEach');

@Injectable({
  providedIn: 'root'
})
export class CamService {
  baseUrl = environment.spaqrlApiUrl;
  curieUtil: any;
  loading = false;
  cam: Cam;
  onCamsChanged: BehaviorSubject<any>;
  onCamChanged: BehaviorSubject<any>;
  onCamTermsChanged: BehaviorSubject<any>;


  public annoton: Annoton;
  private camForm: CamForm;
  private camFormGroup: BehaviorSubject<FormGroup | undefined>;
  public camFormGroup$: Observable<FormGroup>;


  constructor(public noctuaFormConfigService: NoctuaFormConfigService,
    private _fb: FormBuilder,
    private httpClient: HttpClient,
    private noctuaUserService: NoctuaUserService,
    private noctuaGraphService: NoctuaGraphService,
    private noctuaLookupService: NoctuaLookupService,
    private curieService: CurieService) {
    this.onCamsChanged = new BehaviorSubject(null);
    this.onCamChanged = new BehaviorSubject(null);
    this.onCamTermsChanged = new BehaviorSubject(null);

    this.curieUtil = this.curieService.getCurieUtil();

    this.camFormGroup = new BehaviorSubject(null);
    this.camFormGroup$ = this.camFormGroup.asObservable();

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

    const camFormMetadata = new AnnotonFormMetadata(self.noctuaLookupService.golrLookup.bind(self.noctuaLookupService));
    const camForm = new CamForm(camFormMetadata);

    camForm.createCamForm(this.cam, this.noctuaUserService.user);

    return camForm;
  }

  getCam(modelId): Cam {
    const self = this;

    const cam: Cam = new Cam();

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

  deleteAnnoton(annoton: Annoton) {
    const self = this;
    const deleteData = annoton.createDelete();

    return self.noctuaGraphService.deleteAnnoton(self.cam, deleteData.uuids, deleteData.triples);
  }

  getUniqueEvidence(formAnnoton?: Annoton) {

    const evidences = formAnnoton ?
      this.cam.addUniqueEvidencesFromAnnoton(formAnnoton) :
      [];
    return this.cam.getUniqueEvidences(evidences);
  }
}
