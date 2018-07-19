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

  getCamsGoTerms(): Observable<any> {
    return this.httpClient.get(this.baseUrl + this.buildCamsGoTermsQuery())
      .pipe(
        map(res => res['results']),
        map(res => res['bindings'])
      );
  }

  getCamsGps(): Observable<any> {
    return this.httpClient.get(this.baseUrl + this.buildCamsGpsQuery())
      .pipe(
        map(res => res['results']),
        map(res => res['bindings'])
      );
  }

  buildCamsGoTermsQuery() {
    const query = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX metago: <http://model.geneontology.org/>
    	  PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX definition: <http://purl.obolibrary.org/obo/IAO_0000115>
        PREFIX BP: <http://purl.obolibrary.org/obo/GO_0008150>
        PREFIX MF: <http://purl.obolibrary.org/obo/GO_0003674>
        PREFIX CC: <http://purl.obolibrary.org/obo/GO_0005575>

		    SELECT distinct ?model ?aspect ?term ?gonames ?definitions
        WHERE
        {
  		    GRAPH ?model {
    			    ?model metago:graphType metago:noctuaCam  .
              ?entity rdf:type owl:NamedIndividual .
    			    ?entity rdf:type ?term
          }
          VALUES ?aspect { BP: MF: CC:  } .
          # rdf:type faster then subClassOf+ but require filter
          # ?term rdfs:subClassOf+ ?aspect .
    		  ?entity rdf:type ?aspect .

  			  # Filtering out the root BP, MF & CC terms
			    filter(?term != MF: )
  			  filter(?term != BP: )
          filter(?term != CC: )

          # then getting their definitions
    		  ?term rdfs:label ?gonames .
  		    ?term definition: ?definitions .
        }
		    ORDER BY DESC(?model)`;

    return '?query=' + encodeURIComponent(query);
  }

  buildCamsGpsQuery() {
    const query = `
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
    GROUP BY ?models`;

    return '?query=' + encodeURIComponent(query);
  }
}
