import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { map, finalize, filter, reduce, catchError, retry, tap } from 'rxjs/operators';

import { NoctuaUtils } from '@noctua/utils/noctua-utils';
import { CurieService } from '@noctua.curie/services/curie.service';
import { NoctuaGraphService } from '@noctua.form/services/graph.service';

import { AnnotonNode } from '@noctua.form/models/annoton/annoton-node';
import { NoctuaFormConfigService } from '@noctua.form/services/config/noctua-form-config.service';
import { SummaryGridService } from '@noctua.form/services/summary-grid.service';
import { Cam } from '../../models/cam';
import { CamRow } from '../../models/cam-row';
import { Curator } from '../../models/curator';
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
  loading: boolean = false;
  onCamsChanged: BehaviorSubject<any>;
  onCamChanged: BehaviorSubject<any>;

  searchSummary: any = {}

  constructor(private noctuaFormConfigService: NoctuaFormConfigService,
    private summaryGridService: SummaryGridService,
    private httpClient: HttpClient,
    private noctuaGraphService: NoctuaGraphService,
    private curieService: CurieService) {
    this.onCamsChanged = new BehaviorSubject({});
    this.onCamChanged = new BehaviorSubject({});
    this.curieUtil = this.curieService.getCurieUtil();
  }

  //GO:0099160
  getCamsByGoTerm(term): Observable<any> {
    const self = this;

    self.loading = true;
    self.searchSummary = {}
    return this.httpClient
      .get(this.baseUrl + this.buildCamsByGoTermQuery(term))
      .pipe(
        map(res => res['results']),
        map(res => res['bindings']),
        tap(val => console.dir(val)),
        map(res => this.addCam(res)),
        tap(val => console.dir(val)),
        tap(res => {
          self.searchSummary =
            {
              term: term
            }
        }),
        finalize(() => {
          self.loading = false;
        })
      );
  }

  //PMID:25869803
  getCamsByPMID(pmid): Observable<any> {
    const self = this;

    self.loading = true;
    self.searchSummary = {}
    return this.httpClient
      .get(this.baseUrl + this.buildCamsPMIDQuery(pmid))
      .pipe(
        map(res => res['results']),
        map(res => res['bindings']),
        tap(val => console.dir(val)),
        map(res => this.addCam(res)),
        tap(val => console.dir(val)), tap(res => {
          self.searchSummary =
            {
              PMID: pmid
            }
        }),

        finalize(() => {
          self.loading = false;
        })
      );
  }

  //Ina Rnor (RGD:2911)
  getCamsByGP(gp): Observable<any> {
    const self = this;

    self.loading = true;
    self.searchSummary = {}
    return this.httpClient
      .get(this.baseUrl + this.buildCamsByGP(gp))
      .pipe(
        map(res => res['results']),
        map(res => res['bindings']),
        tap(val => console.dir(val)),
        map(res => this.addCam(res)),
        tap(val => console.dir(val)),
        tap(res => {
          self.searchSummary =
            {
              'Gene Product': gp
            }
        }),
        finalize(() => {
          self.loading = false;
        })
      );
  }

  getCamsByCurator(orcid): Observable<any> {
    const self = this;

    self.loading = true;
    self.searchSummary = {}
    return this.httpClient
      .get(this.baseUrl + this.buildCamsByCuratorQuery(orcid))
      .pipe(
        map(res => res['results']),
        map(res => res['bindings']),
        tap(res => {
          self.searchSummary =
            {
              curator: orcid
            }
        }),
        tap(val => console.dir(val)),
        map(res => this.addCam(res)),
        tap(val => console.dir(val)),
        finalize(() => {
          self.loading = false;
        })
      );
  }

  getCamsBySpecies(species): Observable<any> {
    const self = this;

    self.loading = true;
    self.searchSummary = {}
    return this.httpClient
      .get(this.baseUrl + this.buildCamsBySpeciesQuery(species.taxon_id))
      .pipe(
        map(res => res['results']),
        map(res => res['bindings']),
        tap(res => {
          self.searchSummary =
            {
              species: species.long_name
            }
        }),
        tap(val => console.dir(val)),
        map(res => this.addCam(res)),
        tap(val => console.dir(val)),
        finalize(() => {
          self.loading = false;
        })
      );
  }

  getAllCurators(): Observable<any> {
    return this.httpClient
      .get(this.baseUrl + this.buildAllCuratorsQuery())
      .pipe(
        map(res => res['results']),
        map(res => res['bindings']),
        tap(val => console.dir(val)),
        map(res => this.addCurator(res)),
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

    res.forEach((cam) => {
      let modelId = this.noctuaFormConfigService.getModelId(cam.model.value);
      result.push({
        id: uuid(),
        graph: null,
        model: Object.assign({}, {
          id: modelId,
          title: cam.modelTitle.value,
          modelInfo: this.noctuaFormConfigService.getModelUrls(modelId)
        }),
        annotatedEntity: {},
        // aspect: this.noctuaFormConfigService.getAspect(this.curieUtil.getCurie(cam.aspect.value)),
        // term: Object.assign({}, {
        //    id: this.curieUtil.getCurie(cam.term.value),
        //  label: cam.termLabel.value
        //   }),
      });
    });
    return result;
  }

  addCurator(res) {
    let result: Array<Curator> = [];

    res.forEach((erg) => {
      result.push({
        orcid: erg.orcid.value,
        name: erg.name.value,
        cams: erg.cams.value,
        group: {
          url: erg.affiliations.value
        }
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
        curatorsCount: erg.curators.value,
        curators: erg.orcids.value.split('@@').map(function (ordcid) {
          return { orcid: ordcid };
        }),
      });
    });
    return result;
  }

  addGroupCurators(groups, curators) {
    const self = this;

    _.each(groups, (group) => {
      _.each(group.curators, (curator) => {
        let srcCurator = _.find(curators, { orcid: curator.orcid })
        curator.name = srcCurator['name'];
        curator.cams = srcCurator['cams'];
      });
    })
  }

  addCamChildren(srcCam, annotons) {
    const self = this;

    srcCam.camRow = [];

    _.each(annotons, function (annoton) {
      let cam = self.annotonToCam(srcCam, annoton);

      cam.model = srcCam.model;
      cam.graph = srcCam.graph;
      srcCam.camRow.push(cam);
    });

    this.onCamsChanged.next(srcCam.camRow);
  }

  annotonToCam(cam, annoton) {

    let destNode = new AnnotonNode()
    destNode.deepCopyValues(annoton.node);

    let result: CamRow = {
      // id: uuid(),
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
      srcNode: annoton.node,
      destNode: destNode
    }

    return result;
  }

  buildCamsByGoTermQuery(goTerm) {
    goTerm = goTerm.replace(":", "_");
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
            ?model metago:graphType metago:noctuaCam;
                  dc:title ?modelTitle .   
            ?entity rdf:type owl:NamedIndividual .
            ?entity rdf:type ?term .
            FILTER(?term = <http://purl.obolibrary.org/obo/` + goTerm + `>)
          }
          VALUES ?aspect { BP: MF: CC: } .
          ?entity rdf:type ?aspect .
          ?term rdfs:label ?termLabel  .
      } `;

    return '?query=' + encodeURIComponent(query);
  }

  buildCamsByGoTermsQuery() {
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
        LIMIT 100`;

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

  buildAllCuratorsQuery() {
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

  buildCamsByCuratorQuery(orcid) {
    let modOrcid = this.getOrcid(orcid);

    let query = `
      PREFIX metago: <http://model.geneontology.org/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> 
      PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
      PREFIX has_affiliation: <http://purl.obolibrary.org/obo/ERO_0000066> 
      PREFIX enabled_by: <http://purl.obolibrary.org/obo/RO_0002333>
      PREFIX obo: <http://www.geneontology.org/formats/oboInOwl#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX BP: <http://purl.obolibrary.org/obo/GO_0008150>
      PREFIX MF: <http://purl.obolibrary.org/obo/GO_0003674>
      PREFIX CC: <http://purl.obolibrary.org/obo/GO_0005575>
          
      SELECT  ?model ?modelTitle	(GROUP_CONCAT(distinct ?spec;separator="&&") as ?species)
                (GROUP_CONCAT(distinct ?goid;separator="&&") as ?bpids)
                (GROUP_CONCAT(distinct ?goname;separator="&&") as ?bpnames)
                (GROUP_CONCAT(distinct ?gpid;separator="&&") as ?gpids)
                (GROUP_CONCAT(distinct ?gpname;separator="&&") as ?gpnames)
      WHERE 
      {
          #BIND("SynGO:SynGO-pim"^^xsd:string as ?orcid) .
          #BIND("http://orcid.org/0000-0001-7476-6306"^^xsd:string as ?orcid)
          #BIND("http://orcid.org/0000-0003-1074-8103"^^xsd:string as ?orcid) .
          #BIND("http://orcid.org/0000-0001-5259-4945"^^xsd:string as ?orcid) .
            
          BIND(` + modOrcid + ` as ?orcid) .
          BIND(IRI(?orcid) as ?orcidIRI) .
                    
          # Getting some information on the model
          GRAPH ?model 
          {
              ?model 	metago:graphType metago:noctuaCam ;
                      dc:date ?date ;
                      dc:title ?modelTitle ;
                      dc:contributor ?orcid .
              
             ?entity rdf:type owl:NamedIndividual .
             ?entity rdf:type ?goid .
  
              ?s enabled_by: ?gpentity .    
              ?gpentity rdf:type ?gpid .
              FILTER(?gpid != owl:NamedIndividual) .
         }
            
          VALUES ?aspect { BP: } . 
          # rdf:type faster then subClassOf+ but require filter 			
          # ?goid rdfs:subClassOf+ ?aspect .
      ?entity rdf:type ?aspect .
      
      # Filtering out the root BP, MF & CC terms
      filter(?goid != MF: )
      filter(?goid != BP: )
      filter(?goid != CC: )
      ?goid rdfs:label ?goname .
            
          # Getting some information on the contributor
          optional { ?orcidIRI rdfs:label ?name } .
          BIND(IF(bound(?name), ?name, ?orcid) as ?name) .
          optional { ?orcidIRI vcard:organization-name ?organization } .
          optional { 
              ?orcidIRI has_affiliation: ?affiliationIRI .
              ?affiliationIRI rdfs:label ?affiliation
          } .
            
        
          # Require each GP to have a correct URI, not the case for SYNGO at this time
          optional {
          ?gpid rdfs:label ?gpname .
          ?gpid rdfs:subClassOf ?v0 . 
          ?v0 owl:onProperty <http://purl.obolibrary.org/obo/RO_0002162> . 
          ?v0 owl:someValuesFrom ?taxon .
                
          ?taxon rdfs:label ?spec .  
          }
            
      }
      GROUP BY ?model ?modelTitle
      ORDER BY DESC(?date)
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
    
        SELECT  distinct ?name ?url         (GROUP_CONCAT(distinct ?orcidIRI;separator="@@") AS ?orcids) 
                                            (COUNT(distinct ?orcidIRI) AS ?curators)
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

  buildCamsPMIDQuery(pmid) {
    let query = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX dc: <http://purl.org/dc/elements/1.1/> 
        PREFIX metago: <http://model.geneontology.org/>
		    SELECT distinct ?model ?modelTitle
        WHERE 
        {
	        GRAPH ?model {
              ?model metago:graphType metago:noctuaCam ;    
                      dc:title ?modelTitle .
        	    ?s dc:source ?source .
            	BIND(REPLACE(?source, " ", "") AS ?source) .
	            FILTER((CONTAINS(?source, "` + pmid + `")))
    	    }           
        }
        LIMIT 100`

    return '?query=' + encodeURIComponent(query);
  }

  buildCamsByGP(gp) {

    const id = this.curieUtil.getIri(gp)

    console.log(id, "===")
    let query = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> 
    PREFIX dc: <http://purl.org/dc/elements/1.1/> 
    PREFIX metago: <http://model.geneontology.org/>
    
    PREFIX enabled_by: <http://purl.obolibrary.org/obo/RO_0002333>
    
    SELECT distinct ?model ?modelTitle
    
    WHERE 
    {
    
      GRAPH ?model {
        ?model metago:graphType metago:noctuaCam;
             dc:title ?modelTitle .
        ?s enabled_by: ?gpnode .    
        ?gpnode rdf:type ?identifier .
        FILTER(?identifier = <` + id + `>) .         
      }
      
    }
    LIMIT 100`

    return '?query=' + encodeURIComponent(query);
  }


  buildCamsBySpeciesQuery(taxon) {
    let taxonUrl = "<http://purl.obolibrary.org/obo/NCBITaxon_" + taxon + ">";

    let query = `
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX owl: <http://www.w3.org/2002/07/owl#>
          PREFIX metago: <http://model.geneontology.org/>
          PREFIX dc: <http://purl.org/dc/elements/1.1/>
  
          PREFIX enabled_by: <http://purl.obolibrary.org/obo/RO_0002333>
          PREFIX in_taxon: <http://purl.obolibrary.org/obo/RO_0002162>
  
          SELECT distinct ?model ?modelTitle
  
          WHERE 
          {
              GRAPH ?model {
                  ?model metago:graphType metago:noctuaCam;
                      dc:title ?modelTitle .
                  ?s enabled_by: ?gpnode .    
                  ?gpnode rdf:type ?identifier .
                  FILTER(?identifier != owl:NamedIndividual) .         
              }
  
              ?identifier rdfs:subClassOf ?v0 . 
              ?identifier rdfs:label ?name .
              
              ?v0 owl:onProperty in_taxon: . 
              ?v0 owl:someValuesFrom ` + taxonUrl + `
          }
          LIMIT 100`
    return '?query=' + encodeURIComponent(query);
  }

  getOrcid(orcid) {
    return "\"" + orcid + "\"^^xsd:string";
  }

}
