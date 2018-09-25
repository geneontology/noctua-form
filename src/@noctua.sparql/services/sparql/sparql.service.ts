import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { map, filter, reduce, catchError, retry, tap } from 'rxjs/operators';

import { NoctuaUtils } from '@noctua/utils/noctua-utils';
import { CurieService } from '@noctua.curie/services/curie.service';
import { NoctuaGraphService } from '@noctua.form/services/graph.service';

import { NoctuaFormConfigService } from '@noctua.form/services/config/noctua-form-config.service';
import { SummaryGridService } from '@noctua.form/services/summary-grid.service';
import { Cam } from '../../models/cam';
import { Contributor } from '../../models/contributor';
import { Group } from '../../models/group';

import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';
declare const require: any;
const each = require('lodash/forEach');

@Injectable({
  providedIn: 'root'
})
export class SparqlService {
  baseUrl = environment.spaqrlApiUrl;
  curieUtil: any;
  cams: any[] = [];
  onCamsChanged: BehaviorSubject<any>;

  constructor(private noctuaFormConfigService: NoctuaFormConfigService,
    private summaryGridService: SummaryGridService,
    private httpClient: HttpClient,
    private noctuaGraphService: NoctuaGraphService,
    private curieService: CurieService) {
    this.onCamsChanged = new BehaviorSubject({});
    this.curieUtil = this.curieService.getCurieUtil();
  }

  //GO:0099160
  getCamsGoTerms(term): Observable<any> {
    return this.httpClient
      .get(this.baseUrl + this.buildCamsGoTermQuery(term))
      .pipe(
        map(res => res['results']),
        map(res => res['bindings']),
        tap(val => console.dir(val)),
        map(res => this.addCam(res)),
        tap(val => console.dir(val))
      );
  }

  getAllContributors(): Observable<any> {
    return this.httpClient
      .get(this.baseUrl + this.buildAllContributorsQuery())
      .pipe(
        map(res => res['results']),
        map(res => res['bindings']),
        tap(val => console.dir(val)),
        map(res => this.addContributor(res)),
        tap(val => console.dir(val))
      );
  }

  getAllGroups(): Observable<any> {
    return this.httpClient
      .get(this.baseUrl + this.buildAllGroupsQuery())
      .pipe(
        map(res => res['results']),
        map(res => res['bindings']),
        tap(val => console.dir(val)),
        map(res => this.addGroup(res)),
        tap(val => console.dir(val))
      );
  }

  addCam(res) {
    let result: Array<Cam> = [];

    res.forEach((erg) => {
      let modelId = this.noctuaFormConfigService.getModelId(erg.model.value);
      result.push({
        id: uuid(),
        treeLevel: 0,
        graph: null,
        model: Object.assign({}, {
          id: modelId,
          title: erg.modelTitle.value,
          modelInfo: this.noctuaFormConfigService.getModelUrls(modelId)
        }),
        annotatedEntity: {},
        relationship: '',
        aspect: this.noctuaFormConfigService.getAspect(this.curieUtil.getCurie(erg.aspect.value)),
        term: Object.assign({}, {
          id: this.curieUtil.getCurie(erg.term.value),
          label: erg.termLabel.value
        }),
        relationshipExt: '',
        extension: {},
        evidence: {},
        reference: '',
        with: '',
        assignedBy: {},
      });
    });
    return result;
  }

  addContributor(res) {
    let result: Array<Contributor> = [];

    res.forEach((erg) => {
      result.push({
        orcid: erg.orcid.value,
        name: erg.name.value,
        cams: erg.cams.value
      });
    });
    return result;
  }

  addGroup(res) {
    let result: Array<Group> = [];

    res.forEach((erg) => {
      result.push({
        url: erg.url.value,
        name: erg.name.value,
        cams: erg.cams.value,
        members: erg.members.value
      });
    });
    return result;
  }

  addCamChildren(srcCam, annotons) {
    const self = this;
    let index = _.findIndex(self.cams, { id: srcCam.id })

    _.each(annotons, function (annoton) {
      let cam = self.annotonToCam(srcCam, annoton);
      self.cams.splice(index + 1, 0, cam);
    });

    this.onCamsChanged.next(this.cams);
  }

  annotonToCam(cam, annoton) {

    console.log(annoton)
    let result: Cam = {
      id: uuid(),
      treeLevel: annoton.treeLevel,
      // model: cam.model,
      annotatedEntity: {
        id: '',
        label: annoton.gp
      },
      relationship: annoton.relationship,
      aspect: annoton.aspect,
      term: annoton.term,
      relationshipExt: annoton.relationshipExt,
      extension: annoton.extension,
      evidence: annoton.evidence,
      reference: annoton.reference,
      with: annoton.with,
      assignedBy: annoton.assignedBy,
    }

    return result;
  }

  getCamsGps(): Observable<any> {
    return this.httpClient.get(this.baseUrl + this.buildCamsGpsQuery()).pipe(
      map(res => res['results']),
      map(res => res['bindings'])
    );
  }

  buildCamsGoTermQuery(go) {
    go = go.replace(":", "_");
    var query = `
    	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX dc: <http://purl.org/dc/elements/1.1/> 
      PREFIX metago: <http://model.geneontology.org/>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX BP: <http://purl.obolibrary.org/obo/GO_0008150>
      PREFIX MF: <http://purl.obolibrary.org/obo/GO_0003674>
      PREFIX CC: <http://purl.obolibrary.org/obo/GO_0005575>

      SELECT distinct ?model ?modelTitle ?aspect ?term ?termLabel 
      WHERE 
      {
        GRAPH ?model {
            ?model metago:graphType metago:noctuaCam .    
            ?entity rdf:type owl:NamedIndividual .
            ?entity rdf:type ?term .
            FILTER(?term = <http://purl.obolibrary.org/obo/` + go + `>)
          }
          VALUES ?aspect { BP: MF: CC: } .
          ?entity rdf:type ?aspect .
          ?model dc:title ?modelTitle .

          ?term rdfs:label ?termLabel  .

      } `;

    return '?query=' + encodeURIComponent(query);
  }

  buildCamsGoTermsQuery() {
    const query = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX dc: <http://purl.org/dc/elements/1.1/> 
        PREFIX metago: <http://model.geneontology.org/>
    	  PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX BP: <http://purl.obolibrary.org/obo/GO_0008150>
        PREFIX MF: <http://purl.obolibrary.org/obo/GO_0003674>
        PREFIX CC: <http://purl.obolibrary.org/obo/GO_0005575>

		    SELECT distinct ?model ?modelTitle ?aspect ?term ?termLabel 
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
          ?model dc:title ?modelTitle .

  			  # Filtering out the root BP, MF & CC terms
			    filter(?term != MF: )
  			  filter(?term != BP: )
          filter(?term != CC: )

    		  ?term rdfs:label ?termLabel  .
        }
     
        ORDER BY DESC(?model)
        LIMIT 20`;

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

  buildAllContributorsQuery() {
    let query = `
      PREFIX metago: <http://model.geneontology.org/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
      PREFIX has_affiliation: <http://purl.obolibrary.org/obo/ERO_0000066> 
          
      SELECT  ?orcid ?name    (GROUP_CONCAT(distinct ?organization;separator="@@") AS ?organizations) 
                              (GROUP_CONCAT(distinct ?affiliation;separator="@@") AS ?affiliations) 
                              (COUNT(distinct ?cam) AS ?cams)
      WHERE 
      {
          ?cam metago:graphType metago:noctuaCam .
          ?cam dc:contributor ?orcid .
                  
          BIND( IRI(?orcid) AS ?orcidIRI ).
                  
          optional { ?orcidIRI rdfs:label ?name } .
          optional { ?orcidIRI <http://www.w3.org/2006/vcard/ns#organization-name> ?organization } .
          optional { ?orcidIRI has_affiliation: ?affiliation } .
            
          BIND(IF(bound(?name), ?name, ?orcid) as ?name) .            
      }
      GROUP BY ?orcid ?name 
      `
    return '?query=' + encodeURIComponent(query);
  }

  buildAllGroupsQuery() {
    let query = `
    PREFIX metago: <http://model.geneontology.org/>
        PREFIX dc: <http://purl.org/dc/elements/1.1/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
        PREFIX has_affiliation: <http://purl.obolibrary.org/obo/ERO_0000066> 
		PREFIX hint: <http://www.bigdata.com/queryHints#>
    
        SELECT  distinct ?name ?url         (COUNT(distinct ?orcidIRI) AS ?members)
                                            (COUNT(distinct ?cam) AS ?cams)
        WHERE    
        {
          ?cam metago:graphType metago:noctuaCam .
          ?cam dc:contributor ?orcid .
          BIND( IRI(?orcid) AS ?orcidIRI ).  
          ?orcidIRI has_affiliation: ?url .
          ?url rdfs:label ?name .     
          hint:Prior hint:runLast true .
        }
        GROUP BY ?url ?name`

    return '?query=' + encodeURIComponent(query);
  }
}
