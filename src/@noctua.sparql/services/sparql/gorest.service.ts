import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';

import * as xml2js from 'xml2js';

export class GOCamSimple {
  gocam: string;
  date: Date;
  title: string;
  names: string[];
  orcids: string[];
}

export class GOCam {
  gocam: string;
  date: string;
  title: string;
  orcids: [string];
  names: [string];
  groupids: [string];
  groupnames: [string];
}

export class GOCamGO {
  gocam: string;
  goclasses: [string];
  goids: [string];
  gonames: [string];
  definitions: [string]
}

@Injectable({
  providedIn: 'root'
})
export class GoRestService {

  baseUrl = environment.gorestApiUrl;
  cams: any[] = [];
  onCamsChanged: BehaviorSubject<any>;

  constructor(private httpClient: HttpClient) { }

  getModels(): Observable<GOCam[]> {
    return this.httpClient.get<[GOCam]>(this.baseUrl + 'models')
      .pipe(
        // map(res => res['results']),
        // map(res => res['bindings'])
      );
  }

  /*
  getModelsGOs(gocams: string[]): Observable<object> {
    var gocamString = gocams.reduce(this.utils.concat);
    return this.http.get(this.baseUrl + "models/go?gocams=" + gocamString);
  }

  getAllModelsGOs(): Observable<GOCamGO[]> {
    return this.httpClient.get<GOCamGO[]>(this.baseUrl + 'models/go/')
      .map(res => res);
  }


  getModelsGPs(gocams: string[]): Observable<object> {
    var gocamString = gocams.reduce(this.utils.concat);
    return this.http.get(this.baseUrl + "models/gp?gocams=" + gocamString);
  }
*/
}
