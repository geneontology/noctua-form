import { Cam, Contributor, Group, Organism } from 'noctua-form-base';
import { each } from 'lodash';

export class SearchCriteria {
    titles: any[] = [];
    gps: any[] = [];
    goterms: any[] = [];
    pmids: any[] = [];
    contributors: Contributor[] = [];
    groups: Group[] = [];
    organisms: Organism[] = [];
    states: any[] = [];

    constructor() {
    }

    query() {
        const self = this;
        let query = ['offset=0&limit=50'];

        each(self.titles, (title) => {
            query.push(`title=${title}`);
        });

        each(self.goterms, (goterm) => {
            query.push(`goterm=${goterm.id}`);
        });

        each(self.groups, (group: Group) => {
            query.push(`group=${group.url}`);
        });

        each(self.contributors, (contributor: Contributor) => {
            query.push(`contributor=${contributor.orcid}`);
        });

        each(self.gps, (gp) => {
            query.push(`gp=${gp.id}`);
        });

        each(self.pmids, (pmid) => {
            query.push(`pmid=${pmid}`);
        });

        each(self.organisms, (organism: Organism) => {
            query.push(`taxon=${organism.taxonIri}`);
        });

        each(self.states, (state: any) => {
            query.push(`state=${state.name}`);
        });

        return query;
    }

    queryEncoded() {
        const self = this;
        const query = ['offset=0&limit=50'];

        each(self.titles, (title) => {
            query.push(`title=${encodeURIComponent(title)}`);
        });

        each(self.goterms, (goterm) => {
            query.push(`goterm=${encodeURIComponent(goterm.id)}`);
        });

        each(self.groups, (group: Group) => {
            query.push(`group=${encodeURIComponent(group.url)}`);
        });

        each(self.contributors, (contributor: Contributor) => {
            query.push(`contributor=${encodeURIComponent(contributor.orcid)}`);
        });

        each(self.gps, (gp) => {
            query.push(`gp=${encodeURIComponent(gp.id)}`);
        });

        each(self.pmids, (pmid) => {
            query.push(`pmid=${encodeURIComponent(pmid)}`);
        });

        each(self.organisms, (organism: Organism) => {
            query.push(`taxon=${encodeURIComponent(organism.taxonIri)}`);
        });

        each(self.states, (state: any) => {
            query.push(`state=${encodeURIComponent(state.name)}`);
        });

        return query;
    }

    build() {
        return this.query().join('&');
    }

    buildEncoded() {
        return this.queryEncoded().join('&');
    }
}
