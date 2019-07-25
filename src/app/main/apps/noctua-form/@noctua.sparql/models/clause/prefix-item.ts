import { Clause } from './clause';
import { Dictionary, Many, map, mapValues, flatMap, castArray } from 'lodash';
import { PREFIX } from './prefix';

export class PrefixItem extends Clause {
    private _prefix

    constructor(prefix: string) {
        super();
        this._prefix = `PREFIX ${prefix}: ${PREFIX[prefix]}`;
    }

    build() {
        return this._prefix;
    }
}
