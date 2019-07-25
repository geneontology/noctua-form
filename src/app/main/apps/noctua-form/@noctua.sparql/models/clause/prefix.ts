import { Clause } from './clause';
import { Dictionary, Many, map, mapValues, flatMap, castArray } from 'lodash';
import { PrefixItem } from './prefix-item';

export const PREFIX = {
    rdf: '<http://www.w3.org/1999/02/22-rdf-syntax-ns#>',
    rdfs: '<http://www.w3.org/2000/01/rdf-schema#>',
    dc: '<http://purl.org/dc/elements/1.1/>',
    metago: '<http://model.geneontology.org/>',
    owl: '<http://www.w3.org/2002/07/owl#>',
    GO: '<http://purl.obolibrary.org/obo/GO_>',
    BP: '<http://purl.obolibrary.org/obo/GO_0008150>',
    MF: '<http://purl.obolibrary.org/obo/GO_0003674>',
    CC: '<http://purl.obolibrary.org/obo/GO_0005575>',
    providedBy: '<http://purl.org/pav/providedBy>'
}

export class Prefix extends Clause {
    private _prefixItems: PrefixItem[];

    constructor() {
        super();
    }

    addPrefixItem(prefixItem: PrefixItem) {
        this._prefixItems.push(prefixItem);
    }

    build() {
        let prefixed = map(this._prefixItems, (item) => {
            return item.build();
        })
        return `${[...prefixed].join('\n')}`;
    }
}
