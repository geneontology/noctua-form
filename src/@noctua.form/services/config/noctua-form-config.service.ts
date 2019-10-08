import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { noctuaFormConfig } from './../../noctua-form-config';
import * as ModelDefinition from './../../data/config/model-definition';
import * as InsertEntityDefinition from './../../data/config/insert-entity-definition';

declare const require: any;

const each = require('lodash/forEach');
import {
  AnnotonNode,
  Annoton,
  Evidence,
  ConnectorAnnoton,
  Entity,
  Predicate
} from './../../models';
import { AnnotonType } from './../../models/annoton/annoton';
import { find } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class NoctuaFormConfigService {
  baseRequestParams;
  baseSpeciesRequestParam;
  requestParams;
  _annotonData;
  _searchFormData;
  _modelRelationship;
  closureCheck;
  loggedIn = false;

  private _baristaToken;

  constructor() {

    this.baseRequestParams = {
      defType: 'edismax',
      indent: 'on',
      qt: 'standard',
      wt: 'json',
      rows: '10',
      start: '0',
      fl: '*,score',
      'facet': true,
      'facet.mincount': 1,
      'facet.sort': 'count',
      'facet.limit': '25',
      'json.nl': 'arrarr',
      packet: '1',
      callback_type: 'search',
      'facet.field': [
        'source',
        'subset',
        'isa_closure_label',
        'is_obsolete'
      ],
      qf: [
        'annotation_class^3',
        'annotation_class_label_searchable^5.5',
        'description_searchable^1',
        'comment_searchable^0.5',
        'synonym_searchable^1',
        'alternate_id^1',
        'isa_closure^1',
        'isa_closure_label_searchable^1'
      ],
      _: Date.now()
    };

    this.baseSpeciesRequestParam = {
      defType: 'edismax',
      qt: 'standard',
      indent: 'on',
      wt: 'json',
      rows: '10',
      start: '0',
      fl: 'bioentity,bioentity_name,qualifier,annotation_class,annotation_extension_json,assigned_by,taxon,evidence_type,evidence_with,panther_family,type,bioentity_isoform,reference,date,bioentity_label,annotation_class_label,taxon_label,panther_family_label,score,id',
      ' facet': true,
      'facet.mincount': 1,
      'facet.sort': 'count',
      ' json.nl': 'arrarr',
      'facet.limit': 0,
      //   hl: true
      ////    hl.simple.pre: <em class="hilite">
      //   hl.snippets: 1000
      'f.taxon_subset_closure_label.facet.limit': -1,
      'fq': 'document_category:"annotation"',
      'facet.field': ['aspect'
        , 'taxon_subset_closure_label'
        , 'type'
        , 'evidence_subset_closure_label'
        , 'regulates_closure_label'
        , 'annotation_class_label'
        , 'qualifier'
        , 'annotation_extension_class_closure_label'
        , 'assigned_by'
        , 'panther_family_label'],
      //  q: *:*
      packet: 3,
      callback_type: 'search',
    };

    this.requestParams = {
      'evidence': Object.assign({}, JSON.parse(JSON.stringify(this.baseRequestParams)), {
        fq: [
          'document_category:"ontology_class"',
          'isa_closure:"ECO:0000352"'
        ],
      })
    };

    this._annotonData = {
      'term': {
        'id': 'goterm',
        'label': 'Molecular Function',
        'aspect': 'F',
        'lookupGroup': 'GO:0003674',
        'treeLevel': 1,
        'ontologyClass': ['go'],
        'termLookup': {
          'requestParams': Object.assign({}, JSON.parse(JSON.stringify(this.baseRequestParams)), {
            fq: [
              'document_category:"ontology_class"',
              'isa_closure:"GO:0003674" OR isa_closure:"GO:0008150" OR isa_closure:"GO:0005575"',
            ],
          }),
        },
        'searchResults': []
      },
      'mc': {
        'id': 'mc',
        'label': 'Macromolecular Complex',
        'relationship': noctuaFormConfig.edge.hasPart,
        'displaySection': noctuaFormConfig.displaySection.gp,
        'displayGroup': noctuaFormConfig.displayGroup.mc,
        'lookupGroup': 'GO:0032991',
        'treeLevel': 1,
        'isExtension': false,
        'ontologyClass': [],
        'termLookup': {
          'requestParams': Object.assign({}, JSON.parse(JSON.stringify(this.baseRequestParams)), {
            fq: [
              'document_category:"ontology_class"',
              'isa_closure:"GO:0032991"'
            ],
          }),
        }
      },
      'gp': {
        'label': 'Gene Product',
        'relationship': noctuaFormConfig.edge.enabledBy,
        'displaySection': noctuaFormConfig.displaySection.gp,
        'displayGroup': noctuaFormConfig.displayGroup.gp,
        'lookupGroup': 'CHEBI:33695',
        'treeLevel': 1,
        'isExtension': false,
        'ontologyClass': [],
        'termLookup': {
          'requestParams': Object.assign({}, JSON.parse(JSON.stringify(this.baseRequestParams)), {
            fq: [
              'document_category:"ontology_class"',
              'isa_closure:"CHEBI:33695"'
              //'isa_closure:"CHEBI:23367"'
            ],
          }),
        }
      },
      'mf': {
        'label': 'Molecular Function',
        'aspect': 'F',
        'relationship': noctuaFormConfig.edge.enabledBy,
        'displaySection': noctuaFormConfig.displaySection.fd,
        'displayGroup': noctuaFormConfig.displayGroup.mf,
        'lookupGroup': 'GO:0003674',
        'treeLevel': 1,
        'isExtension': false,
        'ontologyClass': ['go'],
        'termLookup': {
          'requestParams': Object.assign({}, JSON.parse(JSON.stringify(this.baseRequestParams)), {
            fq: [
              'document_category:"ontology_class"',
              'isa_closure:"GO:0003674"'
            ],
          }),
        }
      },
      'mf-1': {
        'label': 'Has Input (GP/Chemical)',
        'relationship': noctuaFormConfig.edge.hasInput,
        'displaySection': noctuaFormConfig.displaySection.fd,
        'displayGroup': noctuaFormConfig.displayGroup.mf,
        'lookupGroup': 'CHEBI:23367',
        'treeLevel': 2,
        'isExtension': true,
        'ontologyClass': [],
        'termLookup': {
          'requestParams': Object.assign({}, JSON.parse(JSON.stringify(this.baseRequestParams)), {
            fq: [
              'document_category:"ontology_class"',
              'isa_closure:"CHEBI:23367"' //Generic Molecule + GP
            ],
          }),
        }
      },
      'mf-2': {
        "label": 'Happens During (Temporal Phase)',
        "relationship": noctuaFormConfig.edge.happensDuring,
        "displaySection": noctuaFormConfig.displaySection.fd,
        "displayGroup": noctuaFormConfig.displayGroup.mf,
        "lookupGroup": 'GO:0044848',
        'treeLevel': 2,
        'isExtension': true,
        "ontologyClass": ['go'],
        "termLookup": {
          "requestParams": Object.assign({}, JSON.parse(JSON.stringify(this.baseRequestParams)), {
            fq: [
              'document_category:"ontology_class"',
              'isa_closure:"GO:0044848"'
            ],
          }),
        }
      },
      'cc': {
        "label": 'MF occurs in Cellular Component',
        'aspect': 'C',
        "relationship": noctuaFormConfig.edge.occursIn,
        "displaySection": noctuaFormConfig.displaySection.fd,
        "displayGroup": noctuaFormConfig.displayGroup.cc,
        "lookupGroup": 'GO:0005575',
        'treeLevel': 2,
        'isExtension': false,
        "ontologyClass": ['go'],
        "termLookup": {
          "requestParams": Object.assign({}, JSON.parse(JSON.stringify(this.baseRequestParams)), {
            fq: [
              'document_category:"ontology_class"',
              'isa_closure:"GO:0005575"'
            ],
          }),
        }
      },
      'cc-1': {
        "label": 'Part Of (CC)',
        'aspect': 'C',
        "relationship": noctuaFormConfig.edge.partOf,
        "displaySection": noctuaFormConfig.displaySection.fd,
        "displayGroup": noctuaFormConfig.displayGroup.cc,
        "lookupGroup": 'GO:0005575',
        'treeLevel': 3,
        'isExtension': true,
        "ontologyClass": ['go'],
        "termLookup": {
          "requestParams": Object.assign({}, JSON.parse(JSON.stringify(this.baseRequestParams)), {
            fq: [
              'document_category:"ontology_class"',
              'isa_closure:"GO:0005575"'
            ],
          }),
        }
      },
      'cc-1-1': {
        "label": 'Part Of (Cell Type)',
        "relationship": noctuaFormConfig.edge.partOf,
        "displaySection": noctuaFormConfig.displaySection.fd,
        "displayGroup": noctuaFormConfig.displayGroup.cc,
        "lookupGroup": 'CL:0000003',
        'treeLevel': 4,
        'isExtension': true,
        "ontologyClass": ['cl'],
        "termLookup": {
          "requestParams": Object.assign({}, JSON.parse(JSON.stringify(this.baseRequestParams)), {
            fq: [
              'document_category:"ontology_class"',
              'isa_closure:"CL:0000003"'
            ],
          }),
        }
      },
      'cc-1-1-1': {
        "label": 'Part Of (Anatomy)',
        "relationship": noctuaFormConfig.edge.partOf,
        "displaySection": noctuaFormConfig.displaySection.fd,
        "displayGroup": noctuaFormConfig.displayGroup.cc,
        "lookupGroup": 'UBERON:0000061',
        'treeLevel': 5,
        'isExtension': true,
        "ontologyClass": ['uberon'],
        "termLookup": {
          "requestParams": Object.assign({}, JSON.parse(JSON.stringify(this.baseRequestParams)), {
            fq: [
              'document_category:"ontology_class"',
              'isa_closure:"UBERON:0000061"'
            ],
          }),
        }
      },
      'bp': {
        "label": 'MF part of Biological Process',
        'aspect': 'P',
        "relationship": noctuaFormConfig.edge.partOf,
        "displaySection": noctuaFormConfig.displaySection.fd,
        "displayGroup": noctuaFormConfig.displayGroup.bp,
        "lookupGroup": 'GO:0008150',
        'treeLevel': 2,
        'isExtension': false,
        "ontologyClass": ['go'],
        "termLookup": {
          "requestParams": Object.assign({}, JSON.parse(JSON.stringify(this.baseRequestParams)), {
            fq: [
              'document_category:"ontology_class"',
              'isa_closure:"GO:0008150"'
            ],
          }),
        }
      },
      'bp-1': {
        "label": 'Part Of (BP)',
        'aspect': 'P',
        "relationship": noctuaFormConfig.edge.partOf,
        "displaySection": noctuaFormConfig.displaySection.fd,
        "displayGroup": noctuaFormConfig.displayGroup.bp,
        "lookupGroup": 'GO:0008150',
        'treeLevel': 3,
        'isExtension': true,
        "ontologyClass": ['go'],
        "termLookup": {
          "requestParams": Object.assign({}, JSON.parse(JSON.stringify(this.baseRequestParams)), {
            fq: [
              'document_category:"ontology_class"',
              'isa_closure:"GO:0008150"'
            ],
          }),
        }
      },
      'bp-1-1': {
        "label": 'Part Of (BP)',
        'aspect': 'P',
        "relationship": noctuaFormConfig.edge.partOf,
        "displaySection": noctuaFormConfig.displaySection.fd,
        "displayGroup": noctuaFormConfig.displayGroup.bp,
        "lookupGroup": 'GO:0008150',
        'treeLevel': 4,
        'isExtension': true,
        "ontologyClass": ['go'],
        "termLookup": {
          "requestParams": Object.assign({}, JSON.parse(JSON.stringify(this.baseRequestParams)), {
            fq: [
              'document_category:"ontology_class"',
              'isa_closure:"GO:0008150"'
            ],
          }),
        }
      },
    }



    this._searchFormData = {
      "species": {
        'id': 'species',
        "label": 'Macromolecular Complex',
        "lookupGroup": 'GO:0032991',
        'treeLevel': 1,
        "ontologyClass": [],
        "termLookup": {
          "requestParams": Object.assign({}, JSON.parse(JSON.stringify(this.baseRequestParams)), {
            fq: [
              'document_category:"ontology_class"',
              'isa_closure:"GO:0032991"'
            ],
          }),
        },
        'searchResults': []
      },
      "gp": {
        'id': 'gp',
        "label": 'Gene Product',
        "lookupGroup": 'CHEBI:33695',
        'treeLevel': 1,
        "ontologyClass": [],
        "termLookup": {
          "requestParams": Object.assign({}, JSON.parse(JSON.stringify(this.baseRequestParams)), {
            fq: [
              'document_category:"ontology_class"',
              'isa_closure:"CHEBI:33695"'
              //'isa_closure:"CHEBI:23367"'
            ],
          }),
        },
        'searchResults': []
      },
      'goterm': {
        'id': 'goterm',
        "label": 'Molecular Function',
        'aspect': 'F',
        "lookupGroup": 'GO:0003674',
        'treeLevel': 1,
        "ontologyClass": ['go'],
        "termLookup": {
          "requestParams": Object.assign({}, JSON.parse(JSON.stringify(this.baseRequestParams)), {
            fq: [
              'document_category:"ontology_class"',
              'isa_closure:"GO:0003674" OR isa_closure:"GO:0008150" OR isa_closure:"GO:0005575"',
            ],
          }),
        },
        'searchResults': []
      },
      'evidence': {
        'id': 'evidence',
        "label": 'Evidence',
        'aspect': '',
        "lookupGroup": 'ECO:0000352',
        'treeLevel': 1,
        "ontologyClass": ['go'],
        "termLookup": {
          "requestParams": Object.assign({}, JSON.parse(JSON.stringify(this.baseRequestParams)), {
            fq: [
              'document_category:"ontology_class"',
              'isa_closure:"ECO:0000352"'
            ],
          }),
        },
        'searchResults': []
      },
      'contributor': {
        "label": 'Contributor',
        'aspect': 'F',
        "lookupGroup": 'GO:0003674',
        'treeLevel': 1,
        "ontologyClass": ['go'],
        "termLookup": {
          "requestParams": Object.assign({}, JSON.parse(JSON.stringify(this.baseRequestParams)), {
            fq: [
              'document_category:"ontology_class"',
              'isa_closure:"GO:0003674"'
            ],
          }),
        },
        'searchResults': []
      },
      'catalyticActivity': {
        "label": 'Contributor',
        'aspect': 'F',
        "lookupGroup": 'GO:0140096',
        'treeLevel': 1,
        "ontologyClass": ['go'],
        "termLookup": {
          "requestParams": Object.assign({}, JSON.parse(JSON.stringify(this.baseRequestParams)), {
            fq: [
              'document_category:"ontology_class"',
              'isa_closure:"GO:0140096"'
            ],
          }),
        },
        'searchResults': []
      },
    };


    this._modelRelationship = {
      default: {
        nodes: [
          'mf', 'gp', 'mf-1', 'mf-2', 'bp', 'bp-1', 'bp-1-1', 'cc', 'cc-1', 'cc-1-1', 'cc-1-1-1'
        ],
        triples: [{
          subject: 'mf',
          object: 'gp',
          edge: noctuaFormConfig.edge.enabledBy
        }, {
          subject: 'mf',
          object: 'bp',
          edge: noctuaFormConfig.edge.partOf
        }, {
          subject: 'mf',
          object: 'cc',
          edge: noctuaFormConfig.edge.occursIn
        }, {
          subject: 'mf',
          object: 'mf-1',
          edge: noctuaFormConfig.edge.hasInput
        }, {
          subject: 'mf',
          object: 'mf-2',
          edge: noctuaFormConfig.edge.happensDuring
        }, {
          subject: 'bp',
          object: 'bp-1',
          edge: noctuaFormConfig.edge.partOf
        }, {
          subject: 'bp-1',
          object: 'bp-1-1',
          edge: noctuaFormConfig.edge.partOf
        }, {
          subject: 'cc',
          object: 'cc-1',
          edge: noctuaFormConfig.edge.partOf
        }, {
          subject: 'cc-1',
          object: 'cc-1-1',
          edge: noctuaFormConfig.edge.partOf
        }, {
          subject: 'cc-1-1',
          object: 'cc-1-1-1',
          edge: noctuaFormConfig.edge.partOf
        }],
      },
      ccOnly: {
        nodes: [
          'gp', 'cc', 'cc-1', 'cc-1-1', 'cc-1-1-1'
        ],
        overrides: {
          'cc': {
            id: 'cc',
            label: 'GP located in Cellular Component',
            relationship: noctuaFormConfig.edge.locatedIn
          },
          'cc-1': {
            id: 'cc-1',
            relationship: noctuaFormConfig.edge.partOf
          },
          'cc-1-1': {
            id: 'cc-1-1',
            relationship: noctuaFormConfig.edge.partOf,
            treeLevel: 4
          }
        },
        triples: [{
          subject: 'gp',
          object: 'cc',
          edge: noctuaFormConfig.edge.locatedIn
        }, {
          subject: 'cc',
          object: 'cc-1',
          edge: noctuaFormConfig.edge.partOf
        }, {
          subject: 'cc-1',
          object: 'cc-1-1',
          edge: noctuaFormConfig.edge.partOf,
        }, {
          subject: 'cc-1-1',
          object: 'cc-1-1-1',
          edge: noctuaFormConfig.edge.partOf
        }]
      },
      bpOnly: {
        nodes: [
          'mf', 'gp', 'bp', 'cc-1-1', 'cc-1-1-1'
        ],
        overrides: {
          mf: {
            termRequiredList: [],
            id: 'mf',
            display: {
              displaySection: '',
              displayGroup: '',
            },
          },
          'bp': {
            id: 'bp',
            label: 'Biological Process',
          },
          'cc-1-1': {
            id: 'cc-1-1',
            label: 'occurs in (Cell Type)',
            relationship: noctuaFormConfig.edge.occursIn,
            display: {
              displaySection: noctuaFormConfig.displaySection.fd,
              displayGroup: noctuaFormConfig.displayGroup.bp,
            },
            treeLevel: 3
          },
          'cc-1-1-1': {
            id: 'cc-1-1-1',
            relationship: noctuaFormConfig.edge.partOf,
            display: {
              displaySection: noctuaFormConfig.displaySection.fd,
              displayGroup: noctuaFormConfig.displayGroup.bp,
            },
            label: 'part Of (Anatomy)',
            treeLevel: 4
          },
        },
        triples: [{
          subject: 'mf',
          object: 'gp',
          edge: noctuaFormConfig.edge.enabledBy
        }, {
          subject: 'bp',
          object: 'cc-1-1',
          edge: noctuaFormConfig.edge.occursIn
        }, {
          subject: 'cc-1-1',
          object: 'cc-1-1-1',
          edge: noctuaFormConfig.edge.partOf
        }, {
          subject: 'mf',
          object: 'bp',
          edge: noctuaFormConfig.edge.causallyUpstreamOfOrWithin,
          edgeOption: {
            selected: noctuaFormConfig.edge.causallyUpstreamOfOrWithin,
            options: [
              noctuaFormConfig.edge.causallyUpstreamOfOrWithin,
              noctuaFormConfig.edge.causallyUpstreamOf,
              noctuaFormConfig.edge.causallyUpstreamOfPositiveEffect,
              noctuaFormConfig.edge.causallyUpstreamOfNegativeEffect,
              noctuaFormConfig.edge.causallyUpstreamOfOrWithinPositiveEffect,
              noctuaFormConfig.edge.causallyUpstreamOfOrWithinNegativeEffect,
            ]
          }
        }]
      },
      connector: {
        nodes: [
          'mf', 'mf'
        ],
        overrides: {
          mf: {
            termRequiredList: [],
            id: 'mf',
            display: {
              displaySection: '',
              displayGroup: '',
            }
          }
        },
        triples: [{
          subject: 'mf',
          object: 'mf',
          edge: noctuaFormConfig.edge.causallyUpstreamOfOrWithin,
          edgeOption: {
            selected: noctuaFormConfig.edge.causallyUpstreamOfOrWithin,
            options: [
              noctuaFormConfig.edge.causallyUpstreamOfOrWithin,
              noctuaFormConfig.edge.causallyUpstreamOf,
              noctuaFormConfig.edge.causallyUpstreamOfPositiveEffect,
              noctuaFormConfig.edge.causallyUpstreamOfNegativeEffect,
              noctuaFormConfig.edge.causallyUpstreamOfOrWithinPositiveEffect,
              noctuaFormConfig.edge.causallyUpstreamOfOrWithinNegativeEffect,
            ]
          }
        }],
      },
    };



    this.closureCheck = {};

    this.closureCheck[noctuaFormConfig.edge.enabledBy.id] = {
      edge: noctuaFormConfig.edge.enabledBy,
      closures: [{
        subject: noctuaFormConfig.closures.mf
      }, {
        object: noctuaFormConfig.closures.gp
      }, {
        object: noctuaFormConfig.closures.mc
      }]
    };

    this.closureCheck[noctuaFormConfig.edge.partOf.id] = {
      edge: noctuaFormConfig.edge.partOf,
      closures: [{
        subject: noctuaFormConfig.closures.bp
      }, {
        subject: noctuaFormConfig.closures.cl
      }, {
        subject: noctuaFormConfig.closures.ub
      }, {
        subject: noctuaFormConfig.closures.gp
      }, {
        object: noctuaFormConfig.closures.bp
      }, {
        object: noctuaFormConfig.closures.cl
      }, {
        object: noctuaFormConfig.closures.ub
      }, {
        object: noctuaFormConfig.closures.cc
      }]
    };

    this.closureCheck[noctuaFormConfig.edge.occursIn.id] = {
      edge: noctuaFormConfig.edge.occursIn,
      closures: [{
        object: noctuaFormConfig.closures.cc
      }, {
        object: noctuaFormConfig.closures.cl
      }, {
        object: noctuaFormConfig.closures.ub
      }, {
        subject: noctuaFormConfig.closures.bp
      }, {
        subject: noctuaFormConfig.closures.cl
      }, {
        subject: noctuaFormConfig.closures.ub
      }, {
        subject: noctuaFormConfig.closures.cc
      }, {
        subject: noctuaFormConfig.closures.mf
      }]
    };

    this.closureCheck[noctuaFormConfig.edge.hasInput.id] = {
      edge: noctuaFormConfig.edge.hasInput,
      closures: [{
        object: noctuaFormConfig.closures.gpHasInput
      }, {
        subject: noctuaFormConfig.closures.gpHasInput
      }, {
        subject: noctuaFormConfig.closures.mf
      }, {
        object: noctuaFormConfig.closures.mc
      }]
    };

    this.closureCheck[noctuaFormConfig.edge.happensDuring.id] = {
      edge: noctuaFormConfig.edge.happensDuring,
      closures: [{
        subject: noctuaFormConfig.closures.mf
      }, {
        object: noctuaFormConfig.closures.tp
      }]
    };

    this.closureCheck[noctuaFormConfig.edge.hasPart.id] = {
      edge: noctuaFormConfig.edge.hasPart,
      closures: [{
        subject: noctuaFormConfig.closures.mc
      }, {
        object: noctuaFormConfig.closures.gp
      }]
    };

    this.closureCheck[noctuaFormConfig.edge.causallyUpstreamOf.id] = {
      edge: noctuaFormConfig.edge.causallyUpstreamOf,
      closures: [{
        object: noctuaFormConfig.closures.bp
      }, {
        subject: noctuaFormConfig.closures.mf
      }]
    };

    this.closureCheck[noctuaFormConfig.edge.causallyUpstreamOfOrWithin.id] = {
      edge: noctuaFormConfig.edge.causallyUpstreamOfOrWithin,
      closures: [{
        object: noctuaFormConfig.closures.bp
      }, {
        subject: noctuaFormConfig.closures.mf
      }]
    };
  }



  set baristaToken(value) {
    this._baristaToken = value;
    localStorage.setItem('barista_token', value);
  }

  get baristaToken() {
    return this._baristaToken;
  }

  get edges() {
    return noctuaFormConfig.edge;
  }

  get modelState() {
    const options = [
      noctuaFormConfig.modelState.options.development,
      noctuaFormConfig.modelState.options.production,
      noctuaFormConfig.modelState.options.review,
      noctuaFormConfig.modelState.options.closed,
      noctuaFormConfig.modelState.options.delete
    ]

    return {
      options: options,
      selected: options[0]
    }
  }

  findModelState(name) {
    const self = this;

    return find(self.modelState.options, (modelState) => {
      return modelState.name === name;
    });
  }

  get closures() {
    return noctuaFormConfig.closures;
  }

  get evidenceDBs() {
    const options = [
      noctuaFormConfig.evidenceDB.options.pmid,
      noctuaFormConfig.evidenceDB.options.doi,
      noctuaFormConfig.evidenceDB.options.goRef,
    ];

    return {
      options: options,
      selected: options[0]
    };
  }

  get annotonType() {
    const options = [
      noctuaFormConfig.annotonType.options.default,
      noctuaFormConfig.annotonType.options.bpOnly,
      noctuaFormConfig.annotonType.options.ccOnly,
    ];

    return {
      options: options,
      selected: options[0]
    }
  }

  get bpOnlyEdges() {
    const options = [
      noctuaFormConfig.edge.causallyUpstreamOfOrWithin,
      noctuaFormConfig.edge.causallyUpstreamOf,
      noctuaFormConfig.edge.causallyUpstreamOfPositiveEffect,
      noctuaFormConfig.edge.causallyUpstreamOfNegativeEffect,
      noctuaFormConfig.edge.causallyUpstreamOfOrWithinPositiveEffect,
      noctuaFormConfig.edge.causallyUpstreamOfOrWithinNegativeEffect,
    ];

    return {
      options: options,
      selected: options[0]
    };
  }

  get camDisplayType() {
    const options = [
      noctuaFormConfig.camDisplayType.options.model,
      noctuaFormConfig.camDisplayType.options.triple,
      noctuaFormConfig.camDisplayType.options.entity
    ];

    return {
      options: options,
      selected: options[0]
    };
  }

  get causalEffect() {
    const options = [
      noctuaFormConfig.causalEffect.options.positive,
      noctuaFormConfig.causalEffect.options.negative,
      noctuaFormConfig.causalEffect.options.neutral
    ]

    return {
      options: options,
      selected: options[0]
    }
  }

  get connectorProcess() {
    const options = noctuaFormConfig.connectorProcesses;

    return {
      options: options,
      selected: options[0]
    }
  }

  get causalReactionProduct() {
    const options = [
      noctuaFormConfig.causalReactionProduct.options.regulate,
      noctuaFormConfig.causalReactionProduct.options.substrate,
    ];

    return {
      options: options,
      selected: options[0]
    };
  }

  getRequestParams(id) {
    const self = this;

    const nodeData = JSON.parse(JSON.stringify(self._searchFormData[id]));

    return nodeData.termLookup.requestParams;
  }

  getModelUrls(modelId) {
    const self = this;
    const modelInfo: any = {};
    const baristaParams = { 'barista_token': self.baristaToken };
    const modelIdParams = { 'model_id': modelId };

    modelInfo.goUrl = 'http://www.geneontology.org/';
    modelInfo.noctuaUrl = environment.noctuaUrl + '?' + (self.baristaToken ? self._parameterize(baristaParams) : '');
    modelInfo.owlUrl = environment.noctuaUrl + '/download/' + modelId + '/owl';
    modelInfo.gpadUrl = environment.noctuaUrl + '/download/' + modelId + '/gpad';
    modelInfo.graphEditorUrl = environment.noctuaUrl + '/editor/graph/' + modelId + '?' + (self.baristaToken ? self._parameterize(baristaParams) : '');
    modelInfo.saeUrl = environment.workbenchUrl + 'noctua-form?' + (self.baristaToken ? self._parameterize(Object.assign({}, modelIdParams, baristaParams)) : '');
    // modelInfo.logoutUrl = self.baristaLocation + '/logout?' + self._parameterize(baristaParams) + '&amp;return=' + environment.workbenchUrl+'noctua-form?' + self._parameterize(baristaParams)
    // modelInfo.loginUrl = self.baristaLocation + '/login?return=' + environment.workbenchUrl+'noctua-form';

    //Workbenches 
    modelInfo.workbenches = [{
      label: 'Noctua Form',
      url: environment.workbenchUrl + 'noctua-form?' + (self.baristaToken ? self._parameterize(Object.assign({}, modelIdParams, baristaParams)) : self._parameterize(Object.assign({}, modelIdParams))),
    }, {
      label: 'Graph Editor',
      url: modelInfo.graphEditorUrl
    }, {
      label: 'Annotation Preview',
      url: environment.workbenchUrl + 'annpreview?' + (self.baristaToken ? self._parameterize(Object.assign({}, modelIdParams, baristaParams)) : self._parameterize(Object.assign({}, modelIdParams))),
    }, {
      label: 'Function Companion',
      url: environment.workbenchUrl + 'companion?' + (self.baristaToken ? self._parameterize(Object.assign({}, modelIdParams, baristaParams)) : self._parameterize(Object.assign({}, modelIdParams))),
    }, {
      label: 'Cytoscape Layout Tool',
      url: environment.workbenchUrl + 'cytoview?' + (self.baristaToken ? self._parameterize(Object.assign({}, modelIdParams, baristaParams)) : self._parameterize(Object.assign({}, modelIdParams))),
    }, {
      label: 'Gosling (Noctua\'s little GOOSE) ',
      url: environment.workbenchUrl + 'gosling-model?' + (self.baristaToken ? self._parameterize(Object.assign({}, modelIdParams, baristaParams)) : self._parameterize(Object.assign({}, modelIdParams))),
    }, {
      label: 'Inference Explanations',
      url: environment.workbenchUrl + 'inferredrelations?' + (self.baristaToken ? self._parameterize(Object.assign({}, modelIdParams, baristaParams)) : self._parameterize(Object.assign({}, modelIdParams))),
    }, {
      label: 'Macromolecular Complex Creator',
      url: environment.workbenchUrl + 'mmcc?' + (self.baristaToken ? self._parameterize(Object.assign({}, modelIdParams, baristaParams)) : self._parameterize(Object.assign({}, modelIdParams))),
    }, {
      label: 'Pathway View',
      url: environment.workbenchUrl + 'pathwayview?' + (self.baristaToken ? self._parameterize(Object.assign({}, modelIdParams, baristaParams)) : self._parameterize(Object.assign({}, modelIdParams))),
    }, {
      label: 'Annotation Preview',
      url: environment.workbenchUrl + 'noctua-form?' + (self.baristaToken ? self._parameterize(Object.assign({}, modelIdParams, baristaParams)) : self._parameterize(Object.assign({}, modelIdParams))),
    }];

    return modelInfo;
  }

  getNewModelUrl(modelId) {
    const self = this;
    const baristaParams = { 'barista_token': self.baristaToken };
    const modelIdParams = { 'model_id': modelId };
    const url = environment.workbenchUrl + 'noctua-form?' + (self.baristaToken ? self._parameterize(Object.assign({}, modelIdParams, baristaParams)) : self._parameterize(Object.assign({}, modelIdParams)));

    return url;
  }

  getUniversalWorkbenchUrl(workbenchName: string, extraParamString) {
    const self = this;
    const baristaParams = { 'barista_token': self.baristaToken }
    const queryString =
      (self.baristaToken ? self._parameterize(Object.assign({}, baristaParams)) + '&' + extraParamString
        : extraParamString);
    const url = environment.workbenchUrl + workbenchName + '?' + queryString;

    return url;
  }


  createSearchFormData() {
    const self = this;

    return self._searchFormData;
  }

  createAnnotonConnectorModel(upstreamAnnoton: Annoton, downstreamAnnoton: Annoton, srcProcessNode?: AnnotonNode, srcHasInputNode?: AnnotonNode) {
    const self = this;
    const srcUpstreamNode = upstreamAnnoton.getMFNode();
    const srcDownstreamNode = downstreamAnnoton.getMFNode();
    const upstreamNode = self.generateAnnotonNode(srcUpstreamNode.id, { id: 'upstream' });
    const downstreamNode = self.generateAnnotonNode(srcDownstreamNode.id, { id: 'downstream' });
    const processNode = srcProcessNode ? srcProcessNode : self.generateAnnotonNode('bp', { id: 'process' });
    const hasInputNode = srcHasInputNode ? srcHasInputNode : self.generateAnnotonNode('mf-1', { id: 'has-input' });

    upstreamNode.copyValues(srcUpstreamNode);
    downstreamNode.copyValues(srcDownstreamNode);

    const connectorAnnoton = new ConnectorAnnoton(upstreamNode, downstreamNode);
    connectorAnnoton.predicate = new Predicate(null);
    connectorAnnoton.predicate.setEvidenceMeta('eco', self.requestParams['evidence']);
    connectorAnnoton.predicate.setEvidence(srcUpstreamNode.predicate.evidence);
    connectorAnnoton.upstreamAnnoton = upstreamAnnoton;
    connectorAnnoton.downstreamAnnoton = downstreamAnnoton;
    connectorAnnoton.processNode = processNode;
    connectorAnnoton.hasInputNode = hasInputNode;

    return connectorAnnoton;
  }

  createAnnotonModel(modelType: AnnotonType): Annoton {
    switch (modelType) {
      case AnnotonType.default:
        return ModelDefinition.createActivity(ModelDefinition.activityUnitDescription);
      case AnnotonType.bpOnly:
        return ModelDefinition.createActivity(ModelDefinition.bpOnlyAnnotationDescription);
      case AnnotonType.ccOnly:
        return ModelDefinition.createActivity(ModelDefinition.ccOnlyAnnotationDescription);
    }
  }

  insertAnnotonNode(annoton: Annoton,
    subjectNode: AnnotonNode,
    nodeDescription: InsertEntityDefinition.InsertNodeDescription): AnnotonNode {
    return ModelDefinition.insertNode(annoton, subjectNode, nodeDescription);
  }

  generateAnnotonNode(id?, overrides?): AnnotonNode {
    const self = this;
    const nodeDataObject = self._annotonData[id];
    const annotonNode = new AnnotonNode();
    const nodeData = nodeDataObject ?
      JSON.parse(JSON.stringify(nodeDataObject)) :
      JSON.parse(JSON.stringify(self._annotonData['term']));
    const predicate = new Predicate(null);

    predicate.setEvidenceMeta('eco', self.requestParams['evidence']);
    annotonNode.id = (overrides && overrides.id) ? overrides.id : id;
    annotonNode.aspect = nodeData.aspect;
    annotonNode.ontologyClass = nodeData.ontologyClass;
    annotonNode.label = nodeData.label;
    annotonNode.relationship = nodeData.relationship;
    annotonNode.displaySection = (overrides && overrides.displaySection) ? overrides.displaySection : nodeData.displaySection;
    annotonNode.displayGroup = nodeData.displayGroup;
    annotonNode.category = nodeData.lookupGroup;
    annotonNode.treeLevel = nodeData.treeLevel;
    annotonNode.isExtension = nodeData.isExtension;
    annotonNode.setTermLookup(nodeData.termLookup.requestParams);
    annotonNode.setTermOntologyClass(nodeData.ontologyClass);
    annotonNode.predicate = predicate;

    return annotonNode;
  }

  createAnnotonModelFakeData(nodes) {
    const self = this;
    const annoton = self.createAnnotonModel(AnnotonType.default);

    nodes.forEach((node) => {
      const annotonNode = annoton.getNode(node.id);
      const destEvidences: Evidence[] = [];

      annotonNode.term = new Entity(node.term.id, node.term.label);

      each(node.evidence, (evidence) => {
        const destEvidence: Evidence = new Evidence();

        destEvidence.evidence = new Entity(evidence.evidence.id, evidence.evidence.label);
        destEvidence.reference = evidence.reference;
        destEvidence.with = evidence.with;

        destEvidences.push(destEvidence);
      });

      annotonNode.predicate.setEvidence(destEvidences);
    });

    annoton.enableSubmit();
    return annoton;
  }


  findEdge(predicateId) {
    find(noctuaFormConfig.edge, {
      id: predicateId
    })
  }

  createJoyrideSteps() {

    const steps = [{
      type: 'element',
      selector: '#noc-model-section',
      title: 'Model Creation',
      content: `Define model's title and state. <a target="_blank" href="http://wiki.geneontology.org/index.php/Noctua#Starting_a_new_model">more</a>`,
      placement: 'bottom'
    }, {
      type: 'element',
      selector: '#noc-gp-section',
      title: 'Enter gene product',
      content: `Enter gene product or macromolecular complex to be annotated <a target="_blank" href="http://wiki.geneontology.org/index.php/Noctua#Starting_a_new_model">more</a>`,
      placement: 'bottom'
    }, {
      type: 'element',
      selector: '#noc-gp-toggle-button',
      title: 'Select',
      content: `Toggle between gene product or macromolecular complex <a target="_blank" href="http://wiki.geneontology.org/index.php/Noctua#Starting_a_new_model">more</a>`,
      placement: 'left'
    }, {
      type: 'element',
      selector: "#noc-fd-section",
      title: "Enter Molecular Function",
      content: `Enter the molecular function, evidence, and reference. Then enter other optional fields <a target="_blank" href="http://wiki.geneontology.org/index.php/Noctua#Starting_a_new_model">more</a>`,
      placement: 'top'
    }, {
      type: 'element',
      selector: "#noc-submit-row",
      title: "Create The Activity",
      content: 'Check if there are any errors (create button not greyed out). Add the new activity to a model. <a href="http://wiki.geneontology.org/index.php/Noctua#Starting_a_new_model">more</a>',
      placement: 'top'
    }, {
      type: 'element',
      selector: "#noc-start-model-button",
      title: "Model Creation",
      content: `You can also start a new model <a target="_blank" href="http://wiki.geneontology.org/index.php/Noctua#Starting_a_new_model">more</a>`,
      placement: 'left'
    }, {
      type: 'element',
      selector: "#noc-molecular-activities",
      title: "Molecular Activities in the Model",
      content: 'This is where all the molecular activities in this model appear.',
      placement: 'top'
    }];

    return steps;
  }

  getAspect(id) {
    const rootNode = find(noctuaFormConfig.rootNode, { id: id });

    return rootNode ? rootNode.aspect : '';
  }

  getModelId(url: string) {
    return 'gomodel:' + url.substr(url.lastIndexOf('/') + 1)
  }

  getIndividalId(url: string) {
    return 'gomodel:' + url.substr(url.lastIndexOf('/') + 2)
  }

  private _parameterize = (params) => {
    return Object.keys(params).map(key => key + '=' + params[key]).join('&');
  }

}