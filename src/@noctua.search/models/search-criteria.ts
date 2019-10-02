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

    build() {
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

        return query.join('&');
    }
}
