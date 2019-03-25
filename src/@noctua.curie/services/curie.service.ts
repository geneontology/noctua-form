import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { map, filter, reduce, catchError, retry, tap } from 'rxjs/operators';

import { parseContext, CurieUtil } from '@geneontology/curie-util-es5';

declare function require(name: string);

import { goContextConfig } from './../data/go-context';

@Injectable({
  providedIn: 'root'
})
export class CurieService {

  private _curie: any;

  constructor(private httpClient: HttpClient) {
    const map = parseContext(goContextConfig);
    this._curie = new CurieUtil(map);
  }

  getCurieUtil() {
    return this._curie;
  }

}
