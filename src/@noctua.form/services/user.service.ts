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
export class NoctuaUserService {
  baristaToken;
  baristaUrl = environment.globalBaristaLocation;
  onUserChanged: BehaviorSubject<any>;
  user: Contributor;

  public annoton: Annoton;
  // public annotonPresentation;
  private camForm: CamForm;
  private camFormGroup: BehaviorSubject<FormGroup | undefined>;
  public camFormGroup$: Observable<FormGroup>;

  contributors: Contributor[] = [];
  groups: Group[] = [];

  constructor(public noctuaFormConfigService: NoctuaFormConfigService,
    private httpClient: HttpClient, ) {
    this.onUserChanged = new BehaviorSubject(null);
  }

  getUser(): Observable<any> {
    const self = this;

    return this.httpClient
      .get(`${self.baristaUrl}/user_info_by_token/${self.baristaToken}`)
      .pipe(
        finalize(() => {
          //self.loading = false;
        })
      );
  }

  filterContributors(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.contributors.filter((contributor: Contributor) => contributor.name.toLowerCase().indexOf(filterValue) === 0);
  }

  filterGroups(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.groups.filter((group: Group) => group.name.toLowerCase().indexOf(filterValue) === 0);
  }

}
