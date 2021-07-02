import { Cam, Contributor, Group, Organism, Entity } from 'noctua-form-base';
import { each, cloneDeep } from 'lodash';
import { CamPage } from './cam-page';
import { SearchCriteria } from './search-criteria';

export class SearchHistory {

    displaySections: any = [];
    searchCriteriaString: string;
    //searchCriteriaRe: SearchCriteria,

    constructor(searchCriteria: SearchCriteria) {
        //   this.searchCriteria = cloneDeep(searchCriteria)
        this.save(searchCriteria);
    }

    generateHistorySummary(searchCriteria: SearchCriteria) {
        const self = this;
        const threshold = 5;
        let count = 0;

        if (searchCriteria.ids && searchCriteria.ids.length > 0) {
            const ids = searchCriteria.ids.map((id: Entity) => {
                return id.label;
            }).join(', ');
            self._addParam('Model Id(s)', ids);
            count++;
        }

        if (searchCriteria.contributors && searchCriteria.contributors.length > 0) {
            const contributors = searchCriteria.contributors.map((contributor: Contributor) => {
                return contributor.name;
            }).join(', ');

            self._addParam('Contributor(s)', contributors, 'user');
            count++;
        }

        if (searchCriteria.groups && searchCriteria.groups.length > 0) {
            const groups = searchCriteria.groups.map((group: Group) => {
                return group.name;
            }).join(', ');

            self._addParam('Group(s)', groups, 'users');
            count++;
        }
        if (searchCriteria.pmids && searchCriteria.pmids.length > 0) {
            const pmids = searchCriteria.pmids.join(', ');
            self._addParam('Ref', pmids);
            count++;
        }
        if (searchCriteria.terms && searchCriteria.terms.length > 0) {
            const terms = searchCriteria.terms.map((term: Entity) => {
                return term.label;
            }).join(', ');
            self._addParam('Term(s)', terms);
            count++;
        }
        if (searchCriteria.gps && searchCriteria.gps.length > 0) {
            const gps = searchCriteria.gps.map((gp: Entity) => {
                return gp.label;
            }).join(', ');
            self._addParam('GP(s)', gps);
            count++;
        }
        if (searchCriteria.organisms && searchCriteria.organisms.length > 0) {
            const organisms = searchCriteria.organisms.map((organism: Organism) => {
                return organism.taxonName;
            }).join(', ');
            self._addParam('Organism(s)', organisms, 'paw');
            count++;
        }
        if (searchCriteria.states && searchCriteria.states.length > 0) {
            const states = searchCriteria.states.map((state: any) => {
                return state.label;
            }).join(', ');
            self._addParam('State(s)', states, 'tasks');
            count++;
        }

        if (searchCriteria.exactdates && searchCriteria.exactdates.length > 0) {
            const exactdates = searchCriteria.exactdates.join(', ');
            self._addParam('Date', exactdates, 'calendar-day');
            count++;
        }

        if (searchCriteria.startdates && searchCriteria.startdates.length > 0 &&
            searchCriteria.enddates && searchCriteria.enddates.length > 0) {
            const startdate = searchCriteria.startdates[0];
            const enddate = searchCriteria.enddates[0]
            const daterange = `${startdate} - ${enddate}`
            self._addParam('Date Range', daterange, 'calendar-week');
            count++;
        }

        if (count === 0) {
            self._addParam('Default Search', 'Recent Models', 'clock');
        }
    }

    save(searchCriteria: SearchCriteria) {
        this.searchCriteriaString = JSON.stringify(searchCriteria, undefined, 2);
        this.generateHistorySummary(searchCriteria)
    }

    getSearchCriteria(): SearchCriteria {
        const searchCriteria = new SearchCriteria(JSON.parse(this.searchCriteriaString));

        return searchCriteria;
    }

    private _addParam(name: string, value: string, icon?: string) {
        this.displaySections.push({
            name,
            value,
            icon,
        });
    }
}
