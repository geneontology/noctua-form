import { environment } from 'environments/environment'

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';

declare const require: any;

const each = require('lodash/forEach');
const cloneDeep = require('lodash/cloneDeep');

const organisms = require('@noctua.common/data/organisms.json');

@Injectable({
  providedIn: 'root'
})
export class NoctuaDataService {

  constructor(private httpClient: HttpClient) {
  }

  get organisms() {
    return organisms
  }
}
