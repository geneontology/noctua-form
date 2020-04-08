import { environment } from './../../../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatDrawer } from '@angular/material/sidenav';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { map, filter, reduce, catchError, retry, tap } from 'rxjs/operators';

import { CurieService } from './../../../../../../../@noctua.curie/services/curie.service';
import { NoctuaGraphService } from 'noctua-form-base';

import { NoctuaFormConfigService } from 'noctua-form-base';


import { Contributor } from 'noctua-form-base';
import { Group } from 'noctua-form-base';


import { v4 as uuid } from 'uuid';
declare const require: any;
const each = require('lodash/forEach');

@Injectable({
  providedIn: 'root'
})
export class CamTableService {

  constructor() {
  }

}
