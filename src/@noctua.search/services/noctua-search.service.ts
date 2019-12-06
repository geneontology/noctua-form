import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';

import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';
import {
    Cam,
    Contributor,
    Group,
    Organism,
    NoctuaFormConfigService,
    NoctuaUserService,
    Entity,
    Article,
    noctuaFormConfig
} from 'noctua-form-base';
import { SearchCriteria } from './../models/search-criteria';


import { saveAs } from 'file-saver';
import { forOwn } from 'lodash';
import { CurieService } from '@noctua.curie/services/curie.service';
import { MatDrawer } from '@angular/material';
import { Router } from '@angular/router';

declare const require: any;

const amigo = require('amigo2');


@Injectable({
    providedIn: 'root'
})
export class NoctuaSearchService {
    linker = new amigo.linker();

    leftPanel = {
        search: {
            id: 1
        }, filter: {
            id: 2
        }, group: {
            id: 3
        }, contributor: {
            id: 4
        }, species: {
            id: 5
        }
    }

    selectedLeftPanel;

    onContributorsChanged: BehaviorSubject<any>;
    onGroupsChanged: BehaviorSubject<any>;
    onOrganismsChanged: BehaviorSubject<any>;

    contributors: Contributor[] = [];
    groups: Group[] = [];
    organisms: Organism[] = [];
    states: any[] = [];

    private leftDrawer: MatDrawer;
    private rightDrawer: MatDrawer;
    onSearcCriteriaChanged: BehaviorSubject<any>;
    baseUrl = environment.spaqrlApiUrl;
    curieUtil: any;
    cams: any[] = [];
    searchCriteria: SearchCriteria;
    baristaApi = environment.globalBaristaLocation;
    separator = '@@';
    loading = false;
    onCamsChanged: BehaviorSubject<any>;
    onCamChanged: BehaviorSubject<any>;
    onContributorFilterChanged: BehaviorSubject<any>;
    searchSummary: any = {};

    filterType = {
        titles: 'titles',
        gps: 'gps',
        goterms: 'goterms',
        pmids: 'pmids',
        contributors: 'contributors',
        groups: 'groups',
        organisms: 'organisms',
        states: 'states'
    };

    constructor(private httpClient: HttpClient,
        public noctuaFormConfigService: NoctuaFormConfigService,
        public noctuaUserService: NoctuaUserService,
        private sparqlService: SparqlService,
        private curieService: CurieService,
        private _router: Router) {
        this.onContributorsChanged = new BehaviorSubject([]);
        this.onGroupsChanged = new BehaviorSubject([]);
        this.onOrganismsChanged = new BehaviorSubject([]);

        this.selectedLeftPanel = this.leftPanel.search;
        this.states = this.noctuaFormConfigService.modelState.options;
        this.searchCriteria = new SearchCriteria();
        this.onSearcCriteriaChanged = new BehaviorSubject(null);
        this.onCamsChanged = new BehaviorSubject({});
        this.onCamChanged = new BehaviorSubject({});
        this.curieUtil = this.curieService.getCurieUtil();

        this.onSearcCriteriaChanged.subscribe((searchCriteria: SearchCriteria) => {
            if (!searchCriteria) {
                return;
            }

            this.getCams(searchCriteria).subscribe((response: any) => {
                this.sparqlService.cams = this.cams = response;
                this.sparqlService.onCamsChanged.next(this.cams);
            });
        });
    }

    search(searchCriteria) {
        this.searchCriteria = new SearchCriteria();

        searchCriteria.title ? this.searchCriteria.titles.push(searchCriteria.title) : null;
        searchCriteria.contributor ? this.searchCriteria.contributors.push(searchCriteria.contributor) : null;
        searchCriteria.group ? this.searchCriteria.groups.push(searchCriteria.group) : null;
        searchCriteria.pmid ? this.searchCriteria.pmids.push(searchCriteria.pmid) : null;
        searchCriteria.goterm ? this.searchCriteria.goterms.push(searchCriteria.goterm) : null;
        searchCriteria.gp ? this.searchCriteria.gps.push(searchCriteria.gp) : null;
        searchCriteria.organism ? this.searchCriteria.organisms.push(searchCriteria.organism) : null;
        searchCriteria.state ? this.searchCriteria.states.push(searchCriteria.state) : null;

        this.updateSearch();
    }

    paramsToSearch(param) {
        this.searchCriteria = new SearchCriteria();

        param.title ? this.searchCriteria.titles.push(param.title) : null;
        param.contributor ? this.searchCriteria.contributors.push(param.contributor) : null;
        param.group ? this.searchCriteria.groups.push(param.group) : null;
        param.pmid ? this.searchCriteria.pmids.push(param.pmid) : null;
        param.goterm ? this.searchCriteria.goterms.push(
            new Entity(param.goterm, '')) : null;
        param.gp ? this.searchCriteria.gps.push(
            new Entity(param.gp, '')) : null;
        param.organism ? this.searchCriteria.organisms.push(param.organism) : null;
        param.state ? this.searchCriteria.states.push(param.state) : null;

        this.updateSearch();
    }

    updateSearch() {
        this.onSearcCriteriaChanged.next(this.searchCriteria);
    }

    filter(filterType, filter) {
        this.searchCriteria[filterType].push(filter);
        this.updateSearch();
    }

    removeFilterType(filterType: string) {
        this.searchCriteria[filterType] = [];
        this.updateSearch();
    }

    removeFilter(filterType) {
        this.searchCriteria[filterType] = null;
    }

    clearSearchCriteria() {
        this.searchCriteria = new SearchCriteria();
        this.updateSearch();
    }

    downloadSearchConfig() {
        let blob = new Blob([JSON.stringify(this.searchCriteria, undefined, 2)], { type: "application/json" });
        saveAs(blob, "search-filter.json");
    }

    uploadSearchConfig(searchCriteria) {
        this.searchCriteria = new SearchCriteria();

        if (searchCriteria.titles) {
            this.searchCriteria.titles = searchCriteria.titles;
        }
        if (searchCriteria.contributors) {
            this.searchCriteria.contributors = searchCriteria.contributors;
        }
        if (searchCriteria.groups) {
            this.searchCriteria.groups = searchCriteria.groups;
        }
        if (searchCriteria.pmids) {
            this.searchCriteria.pmids = searchCriteria.pmids;
        }
        if (searchCriteria.goterms) {
            this.searchCriteria.goterms = searchCriteria.goterms;
        }
        if (searchCriteria.gps) {
            this.searchCriteria.gps = searchCriteria.gps;
        }
        if (searchCriteria.organisms) {
            this.searchCriteria.organisms = searchCriteria.organisms;
        }
        if (searchCriteria.states) {
            this.searchCriteria.states = searchCriteria.states;
        }

        this.updateSearch();
    }

    getCams(searchCriteria: SearchCriteria): Observable<any> {
        const self = this;
        const query = searchCriteria.build();
        const url = `${this.baristaApi}/search?${query}`;

        self.loading = true;

        return this.httpClient
            .get(url)
            .pipe(
                tap(val => console.dir(val)),
                map(res => this.addCam(res)),
                tap(val => console.dir(val)),
                finalize(() => {
                    self.loading = false;
                })
            );
    }

    addCam(res) {
        const self = this;
        let result: Array<Cam> = [];

        res.models.forEach((response) => {
            let modelId = response.id;
            let cam = new Cam();

            cam.graph = null;
            cam.id = modelId;
            cam.state = self.noctuaFormConfigService.findModelState(response.state);
            cam.title = response.title;
            cam.date = response.date

            cam.model = Object.assign({}, {
                modelInfo: this.noctuaFormConfigService.getModelUrls(modelId)
            });

            cam.groups = <Group[]>response.groups.map(function (url) {
                let group = _.find(self.noctuaUserService.groups, (group: Group) => {
                    return group.url === url
                })

                return group ? group : { url: url };
            });

            cam.contributors = <Contributor[]>response.contributors.map((orcid) => {
                let contributor = _.find(self.noctuaUserService.contributors, (contributor: Contributor) => {
                    return contributor.orcid === orcid
                })

                return contributor ? contributor : { orcid: orcid };
            });

            forOwn(response.query_match, (individuals) => {
                cam.filter.uuids.push(...individuals.map((iri) => {
                    return self.curieUtil.getCurie(iri);
                }));
            });

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

    getPubmedInfo(pmid: string) {
        const self = this;
        const url = environment.pubMedSummaryApi + pmid;

        return this.httpClient
            .get(url)
            .pipe(
                map(res => res['result']),
                map(res => res[pmid]),
                tap(val => console.dir(val)),
                map(res => this._addArticles(res, pmid)),
                tap(val => console.dir(val)),
            );
    }

    private _addArticles(res, pmid: string) {
        const self = this;
        if (!res) {
            return;
        }

        const article = new Article();
        article.title = res.title;
        article.link = self.linker.url(`${noctuaFormConfig.evidenceDB.options.pmid.name}:${pmid}`);
        article.date = res.pubdate;
        if (res.authors && Array.isArray(res.authors)) {
            article.author = res.authors.map(author => {
                return author.name;
            }).join(', ');
        }

        return article;
    }


    selectLeftPanel(panel) {
        this.selectedLeftPanel = panel;
    }

    public setLeftDrawer(leftDrawer: MatDrawer) {
        this.leftDrawer = leftDrawer;
    }

    public openLeftDrawer() {
        return this.leftDrawer.open();
    }

    public closeLeftDrawer() {
        return this.leftDrawer.close();
    }

    public toggleLeftDrawer(panel) {
        if (this.selectedLeftPanel.id === panel.id) {
            this.leftDrawer.toggle();
        } else {
            this.selectLeftPanel(panel)
            return this.openLeftDrawer();
        }
    }

    public setRightDrawer(rightDrawer: MatDrawer) {
        this.rightDrawer = rightDrawer;
    }

    public openRightDrawer() {
        return this.rightDrawer.open();
    }

    public closeRightDrawer() {
        return this.rightDrawer.close();
    }

    public groupContributors() {
        return _.groupBy(this.contributors, function (contributor) {
            return contributor.group;
        });

    }

    public filterOrganisms(value: string): any[] {
        const filterValue = value.toLowerCase();

        return this.organisms.filter(organism => organism.taxonName.toLowerCase().indexOf(filterValue) === 0);
    }

    public filterStates(value: string): any[] {
        const filterValue = value.toLowerCase();

        return this.states.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
    }
}
