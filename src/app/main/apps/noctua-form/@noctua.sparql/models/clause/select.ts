import { Clause } from './clause';
import { Dictionary, Many, map, mapValues, flatMap, castArray } from 'lodash';

export class Select extends Clause {
    private _properties

    constructor(properties: any[]) {
        super();
        this._properties = properties;
    }

    build() {
        return `SELECT ${[...this._properties].join('\n')}`;
    }
}
