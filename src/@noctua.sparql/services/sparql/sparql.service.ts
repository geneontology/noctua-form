import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SparqlService {
  baseUrl = environment.spaqrlApiUrl;
  cams: any[] = [];
  onCamsChanged: BehaviorSubject<any>;

  constructor(private httpClient: HttpClient) {
    this.onCamsChanged = new BehaviorSubject({});
  }

  getModelGOs(id) {
    return this.httpClient.get(this.baseUrl + this.ModelGOs(id));
  }

  getModelsGPs(): Observable<any> {
    return this.httpClient.get(this.baseUrl + this.AllModelsGOs())
      .pipe(
        map(res => res['results']),
        map(res => res['bindings'])
      );
  }

  getAllModelsGPs() {
    return this.httpClient.get(this.baseUrl + this.AllModelsGPs());
  }

  AllModelsGPs() {
    var encoded = encodeURIComponent(`
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> 
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX metago: <http://model.geneontology.org/>
    
    PREFIX enabled_by: <http://purl.obolibrary.org/obo/RO_0002333>
    PREFIX in_taxon: <http://purl.obolibrary.org/obo/RO_0002162>
    
    SELECT ?models (GROUP_CONCAT(distinct ?identifier;separator=";") as ?identifiers)
            (GROUP_CONCAT(distinct ?name;separator=";") as ?names)
    
    WHERE 
    {
      GRAPH ?models {
        ?models metago:graphType metago:noctuaCam .
        ?s enabled_by: ?gpnode .    
        ?gpnode rdf:type ?identifier .
        FILTER(?identifier != owl:NamedIndividual) .
      }
      optional {
        ?identifier rdfs:label ?name
      }
    }
    GROUP BY ?models
        `);
    return "?query=" + encoded;
  }
}
