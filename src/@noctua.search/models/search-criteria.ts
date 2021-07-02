import { Cam, Contributor, Group, Organism } from 'noctua-form-base';
import { each } from 'lodash';
import { CamPage } from './cam-page';

export class SearchCriteria {
    camPage: CamPage = new CamPage();
    titles: any[] = [];
    ids: any[] = [];
    gps: any[] = [];
    terms: any[] = [];
    pmids: any[] = [];
    contributors: Contributor[] = [];
    groups: Group[] = [];
    organisms: Organism[] = [];
    states: any[] = [];
    exactdates: any[] = [];
    startdates: any[] = [];
    enddates: any[] = [];
    expand = true;
    filtersCount = 0;

    constructor(searchCriteria?: SearchCriteria) {
        if (searchCriteria) {
            this.camPage = searchCriteria.camPage || new CamPage();
            this.titles = searchCriteria.titles || [];
            this.contributors = searchCriteria.contributors || [];
            this.groups = searchCriteria.groups || [];
            this.pmids = searchCriteria.pmids || [];
            this.terms = searchCriteria.terms || [];
            this.ids = searchCriteria.ids || [];
            this.gps = searchCriteria.gps || [];
            this.organisms = searchCriteria.organisms || [];
            this.states = searchCriteria.states || [];
            this.exactdates = searchCriteria.exactdates || [];
            this.startdates = searchCriteria.startdates || [];
            this.enddates = searchCriteria.enddates || [];
            this.expand = searchCriteria.expand;
        }
    }

    updateFiltersCount() {
        const self = this;

        self.filtersCount = self.titles.length +
            self.ids.length +
            self.gps.length +
            self.terms.length +
            self.pmids.length +
            self.contributors.length +
            self.groups.length +
            self.organisms.length +
            self.states.length +
            self.exactdates.length +
            self.startdates.length +
            self.enddates.length;
    }

    private query(pagination: boolean = true) {
        const self = this;
        const query = [];

        if (pagination) {
            query.push(`offset=${(self.camPage.pageNumber * self.camPage.size).toString()}`);
            query.push(`limit=${self.camPage.size.toString()}`);
        }

        each(self.titles, (title) => {
            query.push(`title=${title}`);
        });

        each(self.terms, (term) => {
            query.push(`term=${term.id}`);
        });

        each(self.groups, (group: Group) => {
            query.push(`group=${group.url}`);
        });

        each(self.contributors, (contributor: Contributor) => {
            query.push(`contributor=${contributor.orcid}`);
        });

        each(self.ids, (id) => {
            query.push(`id=${id}`);
        });

        each(self.gps, (gp) => {
            query.push(`gp=${gp.id}`);
        });

        each(self.pmids, (pmid) => {
            query.push(`pmid=${pmid}`);
        });

        each(self.exactdates, (date) => {
            query.push(`exactdate=${date}`);
        });

        each(self.startdates, (date) => {
            query.push(`date=${date}`);
        });

        each(self.enddates, (date) => {
            query.push(`dateend=${date}`);
        });

        each(self.organisms, (organism: Organism) => {
            query.push(`taxon=${organism.taxonIri}`);
        });

        each(self.states, (state: any) => {
            query.push(`state=${state.name}`);
        });

        if (self.expand) {
            query.push('expand');
        }

        query.push('debug')

        return query;
    }

    build(pagination: boolean = true) {
        return this.query(pagination).join('&');
    }

    clearSearch() {
        this.titles = [];
        this.contributors = [];
        this.groups = [];
        this.pmids = [];
        this.terms = [];
        this.gps = [];
        this.organisms = [];
        this.states = [];
        this.exactdates = [];
        this.startdates = [];
        this.enddates = [];
    }


}
