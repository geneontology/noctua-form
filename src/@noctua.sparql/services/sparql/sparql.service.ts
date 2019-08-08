import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { map, finalize, filter, reduce, catchError, retry, tap } from 'rxjs/operators';
import {
  Graph,
  Optional,
  optional,
  Prefix,
  prefix,
  Triple,
  Query,
  triple,
} from "sparql-query-builder/dist";

import {
  NoctuaQuery
} from "noctua-sparql-query-builder/dist";

import { CurieService } from './../../../@noctua.curie/services/curie.service';
import {
  NoctuaGraphService,
  AnnotonNode,
  NoctuaFormConfigService,
  Cam,
  CamRow,
  Contributor,
  Group,
  NoctuaUserService,
  Organism,
  Entity
} from 'noctua-form-base'

import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { SearchCriteria } from '@noctua.search/models/search-criteria';
import { SparqlMinervaService } from './sparql-minerva.service';
declare const require: any;

const each = require('lodash/forEach');
const forOwn = require('lodash/forOwn');
const uuid = require('uuid/v1');

@Injectable({
  providedIn: 'root'
})
export class SparqlService {
  minervaDefinitionName = environment.globalMinervaDefinitionName;
  separator = '@@';
  baseUrl = environment.spaqrlApiUrl;
  curieUtil: any;
  cams: any[] = [];
  loading: boolean = false;
  onCamsChanged: BehaviorSubject<any>;
  onCamChanged: BehaviorSubject<any>;
  onContributorFilterChanged: BehaviorSubject<any>;

  searchSummary: any = {}

  constructor(public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaUserService: NoctuaUserService,
    private httpClient: HttpClient,
    private noctuaGraphService: NoctuaGraphService,
    private sparqlMinervaService: SparqlMinervaService,
    private curieService: CurieService) {
    this.onCamsChanged = new BehaviorSubject({});
    this.onCamChanged = new BehaviorSubject({});
    this.curieUtil = this.curieService.getCurieUtil();
  }

  getCams(searchCriteria): Observable<any> {
    const self = this;

    let query = this.buildCamsQuery(searchCriteria)
    let url = `${this.baseUrl}?query=${encodeURIComponent(query)}`

    self.loading = true;

    this.sparqlMinervaService.foo(query);

    return this.httpClient
      .get(url)
      .pipe(
        map(res => res['results']),
        map(res => res['bindings']),
        tap(val => console.dir(val)),
        map(res => this.addCam(res)),
        tap(val => console.dir(val)),
        finalize(() => {
          self.loading = false;
        })
      );
  }


  getAllContributors(): Observable<any> {
    let query = this.buildAllContributorsQuery();
    let url = `${this.baseUrl}?query=${encodeURIComponent(query)}`

    this.sparqlMinervaService.foo(query);

    return this.httpClient
      .get(url)
      .pipe(
        map(res => res['results']),
        map(res => res['bindings']),
        tap(val => console.dir(val)),
        map(res => this.addContributor(res)),
        tap(val => console.dir(val))
      );
  }

  getAllOrganisms(): Observable<any> {
    let query = this.buildOrganismsQuery();
    let url = `${this.baseUrl}?query=${encodeURIComponent(query)}`

    this.sparqlMinervaService.foo(query);
    return this.httpClient
      .get(url)
      .pipe(
        map(res => res['results']),
        map(res => res['bindings']),
        tap(val => console.dir(val)),
        map(res => this.addOrganism(res)),
        tap(val => console.dir(val))
      );
  }

  getAllGroups(): Observable<any> {
    let query = this.buildAllGroupsQuery();
    let url = `${this.baseUrl}?query=${encodeURIComponent(query)}`

    this.sparqlMinervaService.foo(query);
    return this.httpClient
      .get(url)
      .pipe(
        map(res => res['results']),
        map(res => res['bindings']),
        tap(val => console.dir(val)),
        map(res => this.addGroup(res)),
        tap(val => console.dir(val))
      );
  }

  getModelMeta(modelId): Observable<any> {
    let query = this.buildModelMetaQuery(modelId);
    let url = `${this.baseUrl}?query=${encodeURIComponent(query)}`

    // this.sparqlMinervaService.foo(query);
    return this.httpClient
      .get(url)
      .pipe(
        map(res => res['results']),
        map(res => res['bindings']),
        tap(val => console.dir(val)),
        map(res => this.addCam(res)),
        tap(val => console.dir(val))
      );
  }

  getModelTerms(modelId: string): Observable<any> {
    let query = this.buildModelTermsQuery(modelId);
    let url = `${this.baseUrl}?query=${encodeURIComponent(query)}`

    // this.sparqlMinervaService.foo(query);
    return this.httpClient
      .get(url)
      .pipe(
        map(res => res['results']),
        map(res => res['bindings']),
        tap(val => console.dir(val)),
        map(res => this.addCamTerms(res)),
        tap(val => console.dir(val))
      );
  }

  addCam(res) {
    const self = this;
    let result: Array<Cam> = [];

    res.forEach((response) => {
      let modelId = self.curieUtil.getCurie(response.model.value)//this.noctuaFormConfigService.getModelId(response.model.value);
      let cam = new Cam();

      cam.graph = null;
      cam.id = modelId;
      cam.state = self.noctuaFormConfigService.findModelState(response.modelState.value);
      cam.title = response.modelTitle.value;
      cam.model = Object.assign({}, {
        modelInfo: this.noctuaFormConfigService.getModelUrls(modelId)
      });

      if (response.date) {
        cam.date = response.date.value
      }

      if (response.groups && response.groups.value !== null) {
        cam.groups = <Group[]>response.groups.value.split(self.separator).map(function (url) {
          let group = _.find(self.noctuaUserService.groups, (group: Group) => {
            return group.url === url
          })

          return group ? group : { url: url };
        });
      }

      if (response.contributors && response.contributors.value !== "") {
        cam.contributors = <Contributor[]>response.contributors.value.split(self.separator).map((orcid) => {
          let contributor = _.find(self.noctuaUserService.contributors, (contributor: Contributor) => {
            return contributor.orcid === orcid
          })

          return contributor ? contributor : { orcid: orcid };
        });
      }

      if (response.entities && response.entities.value !== "") {
        cam.filter.uuids.push(...response.entities.value.split(self.separator).map((iri) => {
          return self.curieUtil.getCurie(iri);
        }));
      }

      cam.configureDisplayType();
      result.push(cam);
    });

    return result;
  }

  addCamTerms(res) {
    const self = this;
    let result: Array<Entity> = [];

    res.forEach((response) => {
      let term = new Entity(
        self.curieUtil.getCurie(response.id.value),
        response.label.value
      );

      result.push(term);
    });

    return result;
  }

  addContributor(res) {
    let result: Array<Contributor> = [];

    res.forEach((erg) => {
      let contributor = new Contributor();

      contributor.orcid = erg.orcid.value;
      contributor.name = erg.name.value;
      contributor.cams = erg.cams.value;
      contributor.group = {
        url: erg.affiliations.value
      }
      result.push(contributor);
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
        contributorsCount: erg.contributors.value,
        contributors: erg.orcids.value.split('@@').map(function (orcid) {
          return { orcid: orcid };
        }),
      });
    });
    return result;
  }

  addOrganism(res) {
    let result: Array<Organism> = [];

    res.forEach((erg) => {
      let organism = new Organism()

      organism.taxonIri = erg.taxonIri.value;
      organism.taxonName = erg.taxonName.value;
      organism.cams = erg.cams.value;
      result.push(organism);
    });
    return result;
  }

  addGroupContributors(groups, contributors) {
    const self = this;

    each(groups, (group) => {
      each(group.contributors, (contributor) => {
        let srcContributor = _.find(contributors, { orcid: contributor.orcid })
        contributor.name = srcContributor['name'];
        contributor.cams = srcContributor['cams'];
      });
    })
  }

  //BUILDER

  buildCamsQuery(searchCriteria: SearchCriteria) {
    let query = new NoctuaQuery();

    each(searchCriteria.goterms, (goterm) => {
      query.goterm(goterm.id)
    });

    each(searchCriteria.groups, (group: Group) => {
      query.group(this.getXSD(group.url));
    });

    each(searchCriteria.contributors, (contributor: Contributor) => {
      query.contributor(this.getXSD(contributor.orcid));
    });

    each(searchCriteria.gps, (gp) => {
      query.gp(this.curieUtil.getIri(gp.id));
    });

    each(searchCriteria.pmids, (pmid) => {
      query.pmid(pmid);
    });

    each(searchCriteria.organisms, (organism: Organism) => {
      query.taxon(organism.taxonIri);
    });

    each(searchCriteria.states, (state: any) => {
      query.state(this.getXSD(state.name));
    });

    query.limit(50);

    return query.build();
  }

  buildAllContributorsQuery() {
    let query = new Query();

    query.prefix(
      prefix('rdfs', '<http://www.w3.org/2000/01/rdf-schema#>'),
      prefix('dc', '<http://purl.org/dc/elements/1.1/>'),
      prefix('metago', '<http://model.geneontology.org/>'),
      prefix('has_affiliation', '<http://purl.obolibrary.org/obo/ERO_0000066>'))
      .select(
        '?orcid ?name',
        '(GROUP_CONCAT(distinct ?organization;separator="@@") AS ?organizations)',
        '(GROUP_CONCAT(distinct ?affiliation;separator="@@") AS ?affiliations)',
        '(COUNT(distinct ?cam) AS ?cams)'
      )
      .where(
        triple('?cam', '<http://model.geneontology.org/graphType>', '<http://model.geneontology.org/noctuaCam>'),
        triple('?cam', 'dc:contributor', '?orcid'),
        'BIND( IRI(?orcid) AS ?orcidIRI)',
        optional(
          triple('?orcidIRI', 'rdfs:label', '?name'),
          triple('?orcidIRI', '<http://www.w3.org/2006/vcard/ns#organization-name>', '?organization'),
          triple('?orcidIRI', 'has_affiliation:', '?affiliation')
        ),
        'BIND(IF(bound(?name), ?name, ?orcid) as ?name)')
      .groupBy('?orcid ?name')
      .orderBy('?name', 'ASC');
    return query.build();
  }

  buildOrganismsQuery() {
    let query = new Query();
    let graphQuery = new Query();
    graphQuery.graph('?model',
      '?model metago:graphType metago:noctuaCam',
      triple('?s', 'enabled_by:', '?entity'),
      triple('?entity', 'rdf:type', '?identifier'),
      'FILTER(?identifier != owl:NamedIndividual)'
    );

    query.prefix(
      prefix('rdf', '<http://www.w3.org/1999/02/22-rdf-syntax-ns#>'),
      prefix('rdfs', '<http://www.w3.org/2000/01/rdf-schema#>'),
      prefix('dc', '<http://purl.org/dc/elements/1.1/>'),
      prefix('metago', '<http://model.geneontology.org/>'),
      prefix('owl', '<http://www.w3.org/2002/07/owl#>'),
      prefix('enabled_by', '<http://purl.obolibrary.org/obo/RO_0002333>'),
      prefix('in_taxon', '<http://purl.obolibrary.org/obo/RO_0002162>'))
      .select(
        'distinct ?taxonIri ?taxonName',
        '(COUNT(distinct ?model) AS ?cams)'
      ).where(
        graphQuery,
        triple('?identifier', 'rdfs:subClassOf', '?v0'),
        triple('?v0', 'owl:onProperty', 'in_taxon:'),
        triple('?v0', 'owl:someValuesFrom', '?taxonIri'),
        triple('?taxonIri', 'rdfs:label', '?taxonName'),
      )
      .groupBy('?taxonIri ?taxonName')
      .orderBy('?taxonName', 'ASC')

    return query.build();
  }

  buildAllGroupsQuery() {
    let query = `
    PREFIX metago: <http://model.geneontology.org/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    PREFIX has_affiliation: <http://purl.obolibrary.org/obo/ERO_0000066> 
    PREFIX hint: <http://www.bigdata.com/queryHints#>

    SELECT  distinct ?name ?url         (GROUP_CONCAT(distinct ?orcidIRI;separator="@@") AS ?orcids) 
                                        (COUNT(distinct ?orcidIRI) AS ?contributors)
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

    return query;
  }

  buildModelMetaQuery(modelId) {
    let query = new Query();

    let graphQuery = new Query();
    graphQuery.graph('?model',
      '?model dc:date ?date; dc:title ?modelTitle; modelState: ?modelState; providedBy: ?providedBy; dc:contributor ?orcid',
    );

    query.prefix(
      prefix('rdf', '<http://www.w3.org/1999/02/22-rdf-syntax-ns#>'),
      prefix('rdfs', '<http://www.w3.org/2000/01/rdf-schema#>'),
      prefix('dc', '<http://purl.org/dc/elements/1.1/>'),
      prefix('metago', '<http://model.geneontology.org/>'),
      prefix('gomodel', '<http://model.geneontology.org/>'),
      prefix('owl', '<http://www.w3.org/2002/07/owl#>'),
      prefix('GO', '<http://purl.obolibrary.org/obo/GO_>'),
      prefix('BP', '<http://purl.obolibrary.org/obo/GO_0008150>'),
      prefix('MF', '<http://purl.obolibrary.org/obo/GO_0003674>'),
      prefix('CC', '<http://purl.obolibrary.org/obo/GO_0005575>'),
      prefix('modelState', '<http://geneontology.org/lego/modelstate>'),
      prefix('providedBy', '<http://purl.org/pav/providedBy>'),
      prefix('vcard', '<http://www.w3.org/2006/vcard/ns#>'),
      prefix('has_affiliation', '<http://purl.obolibrary.org/obo/ERO_0000066>'),
      prefix('enabled_by', '<http://purl.obolibrary.org/obo/RO_0002333>'),
      prefix('evidence', '<http://geneontology.org/lego/evidence>'),
      prefix('in_taxon', '<http://purl.obolibrary.org/obo/RO_0002162>'),
      prefix('obo', '<http://www.geneontology.org/formats/oboInOwl#>'))
      .select(
        'distinct ?model ?modelTitle ?modelState ?date',
        '(GROUP_CONCAT(distinct ?entity;separator="@@") as ?entities)',
        '(GROUP_CONCAT(distinct ?orcid;separator="@@") as ?contributors)',
        '(GROUP_CONCAT(distinct ?providedBy;separator="@@") as ?groups)'
      ).where(
        `VALUES ?model { ${modelId} }`,
        graphQuery
      ).groupBy('?model ?modelTitle ?modelState ?date')

    return query.build();
  }

  buildModelTermsQuery(modelId) {
    ` 
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX metago: <http://model.geneontology.org/>
PREFIX gomodel: <http://model.geneontology.org/>
PREFIX definition: <http://purl.obolibrary.org/obo/IAO_0000115>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX GO: <http://purl.obolibrary.org/obo/GO_>
PREFIX BP: <http://purl.obolibrary.org/obo/GO_0008150>
PREFIX MF: <http://purl.obolibrary.org/obo/GO_0003674>
PREFIX CC: <http://purl.obolibrary.org/obo/GO_0005575>
PREFIX modelState: <http://geneontology.org/lego/modelstate>
PREFIX providedBy: <http://purl.org/pav/providedBy>
PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
PREFIX has_affiliation: <http://purl.obolibrary.org/obo/ERO_0000066>
PREFIX enabled_by: <http://purl.obolibrary.org/obo/RO_0002333>
PREFIX evidence: <http://geneontology.org/lego/evidence>
PREFIX in_taxon: <http://purl.obolibrary.org/obo/RO_0002162>
PREFIX obo: <http://www.geneontology.org/formats/oboInOwl#>
SELECT distinct ?model ?modelTitle ?modelState ?date ?gocam ?goclasses ?goids ?gonames ?definitions
	(GROUP_CONCAT(distinct ?entity;separator="@@") as ?entities)
	(GROUP_CONCAT(distinct ?orcid;separator="@@") as ?contributors)
	(GROUP_CONCAT(distinct ?providedBy;separator="@@") as ?groups)



WHERE{
  VALUES ?model { gomodel:5b91dbd100001639} .
GRAPH ?model {
?model dc:date ?date; dc:title ?modelTitle; modelState: ?modelState; providedBy: ?providedBy; dc:contributor ?orcid.
  ?entity rdf:type owl:NamedIndividual .
    			?entity rdf:type ?goids
}
       VALUES ?goclasses { BP: MF: CC:  } . 
  			?goids rdfs:subClassOf+ ?goclasses .
    		?goids rdfs:label ?gonames .
  		    ?goids definition: ?definitions .

}

GROUP BY ?model ?modelTitle ?modelState ?date ?gocam ?goclasses ?goids ?gonames ?definitions`



    let query = new Query();

    let graphQuery = new Query();
    graphQuery.graph('?model',
      triple('?entity', 'rdf:type', 'owl:NamedIndividual'),
      triple('?entity', 'rdf:type', '?id')
    );

    query.prefix(
      prefix('rdf', '<http://www.w3.org/1999/02/22-rdf-syntax-ns#>'),
      prefix('rdfs', '<http://www.w3.org/2000/01/rdf-schema#>'),
      prefix('dc', '<http://purl.org/dc/elements/1.1/ >'),
      prefix('metago', '<http://model.geneontology.org/>'),
      prefix('gomodel', '<http://model.geneontology.org/>'),
      prefix('definition', '<http://purl.obolibrary.org/obo/IAO_0000115>'),
      prefix('owl', '<http://www.w3.org/2002/07/owl#>'),
      prefix('GO', '<http://purl.obolibrary.org/obo/GO_>'),
      prefix('BP', '<http://purl.obolibrary.org/obo/GO_0008150>'),
      prefix('MF', '<http://purl.obolibrary.org/obo/GO_0003674>'),
      prefix('CC', '<http://purl.obolibrary.org/obo/GO_0005575>'),
      prefix('modelState', '<http://geneontology.org/lego/modelstate>'),
      prefix('providedBy', '<http://purl.org/pav/providedBy>'),
      prefix('vcard', '<http://www.w3.org/2006/vcard/ns#>'),
      prefix('has_affiliation', '<http://purl.obolibrary.org/obo/ERO_0000066>'),
      prefix('enabled_by', '<http://purl.obolibrary.org/obo/RO_0002333>'),
      prefix('evidence', '<http://geneontology.org/lego/evidence>'),
      prefix('in_taxon', '<http://purl.obolibrary.org/obo/RO_0002162>'),
      prefix('obo', '<http://www.geneontology.org/formats/oboInOwl#>'))
      .select(
        'distinct ?goclasses ?id ?label ?definition',
      ).where(
        `VALUES ?model { ${modelId} }`,
        graphQuery,
        'VALUES ?goclasses { BP: MF: CC:  }',
        triple('?id', 'rdfs:subClassOf+', '?goclasses'),
        triple('?id', 'rdfs:label', '?label'),
        triple('?id', 'definition:', ' ?definition')
      ).groupBy('?goclasses ?id ?label ?definition')

    return query.build();
  }

  getXSD(s) {
    return "\"" + s + "\"^^xsd:string";
  }

}
