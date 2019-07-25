import { map } from 'lodash';
import { Clause } from './clause';

export class Query {
    protected clauses: Clause[] = [];

    /**
     * Adds a clause to the query list.
     * @param {Clause} clause
     */
    addClause(clause) {
        this.clauses.push(clause);
    }

    build() {
        return `${map(this.clauses, s => s.build()).join('\n')};`;
    }
}
