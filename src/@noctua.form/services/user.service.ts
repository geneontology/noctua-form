import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { map, finalize, filter, reduce, catchError, retry, tap } from 'rxjs/operators';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms'

import { NoctuaFormConfigService } from './../services/config/noctua-form-config.service';
import { NoctuaLookupService } from './lookup.service';
//import { Cam } from '../models/cam';
import { CamRow } from '../models/cam-row';
import { Curator } from '../models/curator';
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
export class NoctuaUserService {
  baristaToken;
  baristaUrl = environment.globalBaristaLocation;
  onUserChanged: BehaviorSubject<any>;
  user: Curator;

  public annoton: Annoton;
  // public annotonPresentation;
  private camForm: CamForm;
  private camFormGroup: BehaviorSubject<FormGroup | undefined>;
  public camFormGroup$: Observable<FormGroup>;

  constructor(public noctuaFormConfigService: NoctuaFormConfigService,
    private httpClient: HttpClient,
    private noctuaLookupService: NoctuaLookupService) {
    this.onUserChanged = new BehaviorSubject(null);

  }

  getUser(): Observable<any> {
    const self = this;

    return this.httpClient
      .get(`${self.baristaUrl}/user_info_by_token/${self.baristaToken}`)
      .pipe(
        tap(res => {
          console.log(res)
        }),
        finalize(() => {
          //self.loading = false;
        })
      );
  }

}
