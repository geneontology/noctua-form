import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { map, filter, reduce, catchError, retry, tap } from 'rxjs/operators';

import { NoctuaUtils } from '@noctua/utils/noctua-utils';
import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

export interface Cam {
    model?: {};
    annotatedEntity?: {};
    relationship?: string;
    aspect?: string;
    term?: {};
    relationshipExt?: string;
    extension?: string;
    evidence?: string;
    reference?: string;
    with?: string;
    assignedBy?: string;
}

@Injectable({
    providedIn: 'root'
})
export class NoctuaSearchService {
    baseUrl = environment.spaqrlApiUrl;
    curieUtil: any;
    cams: any[] = [];
    onCamsChanged: BehaviorSubject<any>;

    constructor(private httpClient: HttpClient, private sparqlService: SparqlService) {
        this.onCamsChanged = new BehaviorSubject({});

    }

    search(searchCriteria) {
        if (searchCriteria.goTerm) {
            this.sparqlService.getCamsByGoTerm(searchCriteria.goTerm).subscribe((response: any) => {
                this.cams = this.sparqlService.cams = response;
                this.sparqlService.onCamsChanged.next(this.cams);
            });
        }

        if (searchCriteria.gp) {
            this.sparqlService.getCamsByGP(searchCriteria.gp).subscribe((response: any) => {
                this.cams = this.sparqlService.cams = response;
                this.sparqlService.onCamsChanged.next(this.cams);
            });
        }

        if (searchCriteria.pmid) {
            this.sparqlService.getCamsByPMID(searchCriteria.pmid).subscribe((response: any) => {
                this.cams = this.sparqlService.cams = response;
                this.sparqlService.onCamsChanged.next(this.cams);
            });
        }
    }

    searchByCurator(searchCriteria) {
        if (searchCriteria.curator) {
            this.sparqlService.getCamsByCurator(searchCriteria.curator).subscribe((response: any) => {
                this.cams = this.sparqlService.cams = response;
                this.sparqlService.onCamsChanged.next(this.cams);
            });
        }
    }
}
