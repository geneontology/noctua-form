import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import {
    Cam,
    Contributor,
    Group,
    Organism,
    NoctuaFormConfigService,
    NoctuaUserService,
    Entity,
    BbopGraphService,
    CamService,
    NoctuaLookupService
} from '@geneontology/noctua-form-base';
import { SearchCriteria, SearchFilterType } from './../models/search-criteria';
import { saveAs } from 'file-saver';
import { find, groupBy } from 'lodash';
import { CurieService } from '@noctua.curie/services/curie.service';
import { CamPage } from './../models/cam-page';
import { SearchHistory } from './../models/search-history';
import { NoctuaDataService } from '@noctua.common/services/noctua-data.service';
import { NoctuaSearchMenuService } from './search-menu.service';
import { MiddlePanel } from '../models/menu-panels';

@Injectable({
    providedIn: 'root'
})
export class NoctuaSearchService {
    searchHistory: SearchHistory[] = [];
    contributors: Contributor[] = [];
    groups: Group[] = [];
    organisms: Organism[] = [];
    states: any[] = [];

    onSearchCriteriaChanged: BehaviorSubject<any>;
    onSearchHistoryChanged: BehaviorSubject<any>;
    onDetailTermChanged: BehaviorSubject<any>;
    curieUtil: any;
    cams: any[] = [];
    camPage: CamPage;
    searchCriteria: SearchCriteria;
    searchApi = environment.searchApi;
    separator = '@@';
    loading = false;
    onCamsChanged: BehaviorSubject<any>;
    onCamsPageChanged: BehaviorSubject<any>;
    onContributorFilterChanged: BehaviorSubject<any>;
    searchSummary: any = {};



    constructor(
        private httpClient: HttpClient,
        private noctuaDataService: NoctuaDataService,
        private _bbopGraphService: BbopGraphService,
        private noctuaLookupService: NoctuaLookupService,
        private camService: CamService,
        public noctuaFormConfigService: NoctuaFormConfigService,
        public noctuaUserService: NoctuaUserService,
        private noctuaSearchMenuService: NoctuaSearchMenuService,
        private curieService: CurieService) {
        this.onDetailTermChanged = new BehaviorSubject(null);
        this.onCamsChanged = new BehaviorSubject([]);
        this.onCamsPageChanged = new BehaviorSubject(null);
        this.onSearchHistoryChanged = new BehaviorSubject(null);
        this.states = this.noctuaFormConfigService.modelState.options;
        this.searchCriteria = new SearchCriteria();
        this.onSearchCriteriaChanged = new BehaviorSubject(null);
        this.curieUtil = this.curieService.getCurieUtil();

        this.onSearchCriteriaChanged.subscribe((searchCriteria: SearchCriteria) => {
            if (!searchCriteria) {
                return;
            }

            this.getCams(searchCriteria).subscribe((response: any) => {
                this.cams = response;
                this.camService.updateDisplayNumber(this.cams);
                this.onCamsChanged.next(this.cams);
            });

            this.getCamsCount(searchCriteria).subscribe((response: any) => {
                this.camPage = new CamPage();
                this.camPage.total = response.n;
                this.onCamsPageChanged.next(this.camPage);
            });

            if (this.noctuaSearchMenuService.selectedMiddlePanel === MiddlePanel.cams) {
                this.noctuaSearchMenuService.scrollToTop();
            }
        });

        this.loadCamRebuild();
    }

    // Get Users and Groups
    setup() {
        const self = this;

        self.noctuaDataService.loadOrganisms();

        self.noctuaDataService.onOrganismsChanged
            .subscribe(organisms => {
                if (organisms) {
                    this.organisms = organisms;
                }
            });

        //For testing
        const contributor =
            {
                'name': 'Tremayne Mushayahama',
                'orcid': 'http://orcid.org/0000-0002-2874-6934',
                'initials': 'TM',
                'color': '#e1bee7'
            } as Contributor;
        //  this.searchCriteria.contributors = [contributor];

        if (this.searchCriteria.terms.length > 0) {
            this.searchFormUrl()
        } else {
            this.updateSearch();
        }
    }

    searchFormUrl() {
        const self = this;
        const promises = []
        const terms = [...this.searchCriteria.gps, ...this.searchCriteria.terms]

        terms.forEach((term) => {
            promises.push(self.noctuaLookupService.getTermDetail(term.id))
        })

        forkJoin(promises).subscribe((response: any[]) => {
            if (response) {
                terms.forEach((term) => {
                    const found = find(response, { id: term.id })
                    Object.assign(term, found)
                })
                this.updateSearch();
            }
        });
    }


    loadCamRebuild() {
        const self = this;
        self._bbopGraphService.onCamRebuildChange.subscribe((inCam: Cam) => {
            if (!inCam) {
                return;
            }

            const cam = find(self.cams, { id: inCam.id }) as Cam;

            if (!cam || !cam.expanded) return;

            this.camService.loadCam(cam);
            this.camService.onCamChanged.next(cam);
        })
    }

    search(searchCriteria) {
        this.searchCriteria = new SearchCriteria();

        searchCriteria.title ? this.searchCriteria.titles.push(searchCriteria.title) : null;
        searchCriteria.contributor ? this.searchCriteria.contributors.push(searchCriteria.contributor) : null;
        searchCriteria.group ? this.searchCriteria.groups.push(searchCriteria.group) : null;
        searchCriteria.pmid ? this.searchCriteria.pmids.push(searchCriteria.pmid) : null;
        searchCriteria.term ? this.searchCriteria.terms.push(searchCriteria.term) : null;
        searchCriteria.obsoleteTerm ? this.searchCriteria.obsoleteTerms.push(searchCriteria.obsoleteTerm) : null;
        searchCriteria.id ? this.searchCriteria.ids.push(searchCriteria.id) : null;
        searchCriteria.gp ? this.searchCriteria.gps.push(searchCriteria.gp) : null;
        searchCriteria.organism ? this.searchCriteria.organisms.push(searchCriteria.organism) : null;
        searchCriteria.state ? this.searchCriteria.states.push(searchCriteria.state) : null;
        searchCriteria.exactdate ? this.searchCriteria.exactdates.push(searchCriteria.exactdate) : null;
        searchCriteria.startdate ? this.searchCriteria.exactdates.push(searchCriteria.startdate) : null;
        searchCriteria.enddate ? this.searchCriteria.exactdates.push(searchCriteria.enddate) : null;

        this.updateSearch();

    }

    getPage(pageNumber: number, pageSize: number) {
        this.searchCriteria.camPage.pageNumber = pageNumber;
        this.searchCriteria.camPage.size = pageSize;
        this.updateSearch();
    }

    paramsToSearch(param) {
        this.searchCriteria.titles = this.makeArray(param.title)
        this.searchCriteria.contributors = this.makeArray(param.contributor, SearchFilterType.contributors)
        this.searchCriteria.groups = this.makeArray(param.group, SearchFilterType.groups)
        this.searchCriteria.pmids = this.makeArray(param.pmid)
        this.searchCriteria.terms = this.makeArray(param.term, SearchFilterType.terms)
        this.searchCriteria.obsoleteTerms = this.makeArray(param.term, SearchFilterType.obsoleteTerms)
        this.searchCriteria.gps = this.makeArray(param.gp, SearchFilterType.gps)
        this.searchCriteria.organisms = this.makeArray(param.organism, SearchFilterType.organisms)
        this.searchCriteria.states = this.makeArray(param.state)
        this.searchCriteria.exactdates = this.makeArray(param.exactdate)
        this.searchCriteria.startdates = this.makeArray(param.startdate)
        this.searchCriteria.enddates = this.makeArray(param.enddate)
    }

    makeArray(val, filterType?: SearchFilterType) {
        let filter;
        if (Array.isArray(val)) {
            filter = val
        }
        if (typeof val === 'string') {
            filter = [val]
        } else {
            filter = []
        }

        switch (filterType) {
            case SearchFilterType.terms:
            case SearchFilterType.gps:
                return filter.map(item => ({ id: item, label: item }));
            case SearchFilterType.contributors:
                return filter.map(item => ({ orcid: item, name: item } as Contributor));
            case SearchFilterType.groups:
                return filter.map(item => ({ url: item, name: item } as Group));
            case SearchFilterType.organisms:
                return filter.map(item => ({ taxonIri: item, taxonName: item } as Organism));
            default:
                return filter;
        }
    }

    updateSearch(pushState = true, save = true) {
        this.searchCriteria.updateFiltersCount();
        this.onSearchCriteriaChanged.next(this.searchCriteria);

        if (save) {
            this.saveHistory();
        }

        if (pushState) {
            if (this.searchCriteria.filtersCount > 0) {
                const query = this.searchCriteria.build();
                const url = `${window.location.origin}${window.location.pathname}?${query}`
                history.pushState({}, '', url)
            } else {
                const url = `${window.location.origin}${window.location.pathname}`
                history.replaceState({}, '', url)
            }

        }
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

    saveHistory() {
        const searchHistoryItem = new SearchHistory(this.searchCriteria);
        this.searchHistory.unshift(searchHistoryItem);

        this.onSearchHistoryChanged.next(this.searchHistory);
    }

    clearHistory() {
        this.searchHistory = [];
        this.onSearchHistoryChanged.next(this.searchHistory);
    }

    downloadSearchConfig() {
        const blob = new Blob([JSON.stringify(this.searchCriteria, undefined, 2)], { type: 'application/json' });
        saveAs(blob, 'search-filter.json');
    }

    uploadSearchConfig(searchCriteria) {
        this.searchCriteria = new SearchCriteria();

        if (searchCriteria.titles) {
            this.searchCriteria.titles = searchCriteria.titles;
        }
        if (searchCriteria.ids) {
            this.searchCriteria.ids = searchCriteria.ids;
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
        if (searchCriteria.terms) {
            this.searchCriteria.terms = searchCriteria.terms;
        }
        if (searchCriteria.obsoleteTerms) {
            this.searchCriteria.obsoleteTerms = searchCriteria.obsoleteTerms;
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
        if (searchCriteria.exactdates) {
            this.searchCriteria.exactdates = searchCriteria.exactdates;
        }
        if (searchCriteria.startdates) {
            this.searchCriteria.startdates = searchCriteria.startdates;
        }
        if (searchCriteria.enddates) {
            this.searchCriteria.enddates = searchCriteria.enddates;
        }

        this.updateSearch();
    }

    getCams(searchCriteria: SearchCriteria): Observable<any> {
        const self = this;
        const query = searchCriteria.build();
        const url = `${this.searchApi}/models?${query}`;

        self.loading = true;

        return this.httpClient
            .get(url)
            .pipe(
                map(res => this.addCam(res)),
                finalize(() => {
                    self.loading = false;
                })
            );
    }

    getCamsCount(searchCriteria: SearchCriteria): Observable<any> {
        const self = this;
        const query = searchCriteria.build();
        const url = `${this.searchApi}/models?${query}&count`;

        return this.httpClient
            .get(url)
            .pipe();
    }

    addCam(res) {
        const self = this;
        const result: Array<Cam> = [];

        res.models.forEach((response) => {
            const modelId = response.id;
            const cam = new Cam();

            cam.graph = null;
            cam.id = modelId;
            cam.state = self.noctuaFormConfigService.findModelState(response.state);
            cam.title = response.title;
            cam.date = response.date;
            cam.modified = response['modified-p'];
            cam.model = Object.assign({}, {
                modelInfo: this.noctuaFormConfigService.getModelUrls(modelId)
            });

            cam.groups = <Group[]>response.groups.map((url) => {
                const group = find(self.noctuaUserService.groups, (inGroup: Group) => {
                    return inGroup.url === url;
                });

                return group ? group : { url: url };
            });

            cam.contributors = <Contributor[]>response.contributors.map((orcid) => {
                const contributor = find(self.noctuaUserService.contributors, (inContributor: Contributor) => {
                    return inContributor.orcid === orcid;
                });

                return contributor ? contributor : { orcid: orcid };
            });

            result.push(cam);
        });

        return result;
    }

    addCamTerms(res) {
        const self = this;
        const result: Array<Entity> = [];

        res.forEach((response) => {
            const term = new Entity(
                self.curieUtil.getCurie(response.id.value),
                response.label.value
            );

            result.push(term);
        });

        return result;
    }

    public groupContributors() {
        return groupBy(this.contributors, function (contributor) {
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
