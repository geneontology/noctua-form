import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
//import 'rxjs/add/operator/pipe';
import { map, catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class SparqlService {

  baseUrl = "http://rdf.geneontology.org/blazegraph/sparql";
  cams: any[] = [];
  onCamsChanged: BehaviorSubject<any>;

  constructor(private httpClient: HttpClient) {
    this.onCamsChanged = new BehaviorSubject({});
  }

  submit(query: string): Observable<any> {
    return this.httpClient.get(this.baseUrl + '?query=' + encodeURIComponent(query));
  }

  getModelGOs(id) {
    return this.httpClient.get(this.baseUrl + this.ModelGOs(id));
  }

  getAllModelsGOs(): Observable<any> {
    return this.httpClient.get(this.baseUrl + this.AllModelsGOs())
      .pipe(
        map(res => res['results']),
        map(res => res['bindings'])
      );
  }

  getAllModelsGPs() {
    return this.httpClient.get(this.baseUrl + this.AllModelsGPs());
  }


  ModelGOs(id) {
    var encoded = encodeURIComponent(`
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX metago: <http://model.geneontology.org/>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX definition: <http://purl.obolibrary.org/obo/IAO_0000115>
    PREFIX BP: <http://purl.obolibrary.org/obo/GO_0008150>
    PREFIX MF: <http://purl.obolibrary.org/obo/GO_0003674>
    PREFIX CC: <http://purl.obolibrary.org/obo/GO_0005575>

    SELECT  ?GO ?GO_classes ?GO_class ?label ?definition
    WHERE 
    {
        VALUES ?GO_classes { BP: MF: CC:  } .
        {
           SELECT * WHERE { ?GO_classes rdfs:label ?GO_class . }
        }

        GRAPH metago:` + id + ` {
            ?GO rdf:type owl:Class .
        }
        ?GO rdfs:subClassOf+ ?GO_classes .
        ?GO rdfs:label ?label .
        ?GO definition: ?definition .

    }
    `);
    return '?query=' + encoded;
  }


  AllModelsGOs() {
    // Transform the array in string
    var encoded = encodeURIComponent(`
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX metago: <http://model.geneontology.org/>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX definition: <http://purl.obolibrary.org/obo/IAO_0000115>
  PREFIX BP: <http://purl.obolibrary.org/obo/GO_0008150>
  PREFIX MF: <http://purl.obolibrary.org/obo/GO_0003674>
  PREFIX CC: <http://purl.obolibrary.org/obo/GO_0005575>

  SELECT distinct ?models ?GO_class ?goid ?goname ?definition
  WHERE 
  {

    GRAPH ?models {
    ?models metago:graphType metago:noctuaCam  .
          ?entity rdf:type owl:NamedIndividual .
    ?entity rdf:type ?goid
      }

      VALUES ?GO_class { BP: MF: CC:  } . 
      # rdf:type faster then subClassOf+ but require filter
      # ?goid rdfs:subClassOf+ ?GO_class .
  ?entity rdf:type ?GO_class .
  
  # Filtering out the root BP, MF & CC terms
  filter(?goid != MF: )
  filter(?goid != BP: )
  filter(?goid != CC: )

  # then getting their definitions
  ?goid rdfs:label ?goname .
    ?goid definition: ?definition .
  }
  ORDER BY DESC(?models)
  `);
    return "?query=" + encoded;
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

export interface SPARQLQuery {
  title: string;
  description: string;
  endpoint: string;
  query: string;
  variables: [{
    name: string;
    comment: string;
  }];
}
