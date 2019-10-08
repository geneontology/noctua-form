import { Entity } from "./../models/annoton/entity";

const edge = {
    placeholder: {
        id: null,
        label: null
    },
    enabledBy: new Entity('RO:0002333', 'enabled by'),
    hasInput: {
        id: 'RO:0002233',
        label: 'has input'
    },
    happensDuring: {
        id: 'RO:0002092',
        label: 'happens during'
    },
    occursIn: {
        id: 'BFO:0000066',
        label: 'occurs in'
    },
    partOf: {
        id: 'BFO:0000050',
        label: 'part of'
    },
    hasPart: {
        id: 'BFO:0000051',
        label: 'has part'
    },
    causallyUpstreamOf: {
        id: 'RO:0002411',
        actsId: 'RO:0002263',
        label: 'causally upstream of',
        actsLabel: 'acts upstream of'
    },
    causallyUpstreamOfOrWithin: {
        id: 'RO:0002418',
        actsId: 'RO:0002264',
        label: 'causally upstream of or within',
        actsLabel: 'acts upstream of or within'
    },
    causallyUpstreamOfPositiveEffect: {
        id: 'RO:0002304',
        actsId: 'RO:0004034',
        label: 'causally upstream of, positive effect',
        actsLabel: 'acts upstream of, positive effect'
    },
    causallyUpstreamOfNegativeEffect: {
        id: 'RO:0002305',
        actsId: 'RO:0004035',
        label: 'causally upstream of, negative effect',
        actsLabel: 'acts upstream of, negative effect'
    },
    causallyUpstreamOfOrWithinPositiveEffect: {
        id: 'RO:0002629',
        actsId: 'RO:0004032',
        label: 'causally upstream of or within, positive effect',
        actsLabel: 'acts upstream of or within, positive effect'
    },
    causallyUpstreamOfOrWithinNegativeEffect: {
        id: 'RO:0002630',
        actsId: 'RO:0004033',
        label: 'causally upstream of or within, negative effect',
        actsLabel: 'acts upstream of or within, negative effect'
    },
    directlyProvidesInput: {
        id: 'RO:0002413',
        label: 'directly provides input'
    },
    regulates: {
        id: 'RO:0002211',
        label: 'regulates'
    },
    positivelyRegulates: {
        id: 'RO:0002213',
        label: 'positively regulates'
    },
    negativelyRegulates: {
        id: 'RO:0002212',
        label: 'negatively regulates'
    },
    directlyRegulates: {
        id: 'RO:0002578',
        label: 'directly regulates'
    },
    directlyPositivelyRegulates: {
        id: 'RO:0002629',
        label: 'directly positively regulates'
    },
    directlyNegativelyRegulates: {
        id: 'RO:0002630',
        label: 'directly negatively regulates'
    },
};

export const noctuaFormConfig = {
    "annotonType": {
        "options": {
            'simple': {
                "name": 'simple',
                "label": 'Single Gene Product'
            },
            'complex': {
                "name": 'complex',
                "label": 'Macromolecular Complex'
            }
        }
    },
    "camDisplayType": {
        "options": {
            'triple': {
                "name": 'triple',
                "label": 'Simple Triple View'
            },
            'entity': {
                "name": 'entity',
                "label": 'Annotated Entity View'
            },
            'model': {
                "name": 'model',
                "label": 'Activity View'
            }
        }
    },
    "modelState": {
        "options": {
            'development': {
                "name": 'development',
                "label": 'Development'
            },
            'production': {
                "name": 'production',
                "label": 'Production'
            },
            'review': {
                "name": 'review',
                "label": 'Review'
            },
            'closed': {
                "name": 'closed',
                "label": 'Closed'
            },
            'delete': {
                "name": 'delete',
                "label": 'Delete'
            }
        }
    },
    "causalEffect": {
        "options": {
            'positive': {
                "name": 'positive',
                "label": 'Positive'
            },
            'negative': {
                "name": 'negative',
                "label": 'Negative'
            },
            'neutral': {
                "name": 'neutral',
                "label": 'Unknown/neutral'
            }
        }
    },
    "causalReactionProduct": {
        "options": {
            "regulate": {
                "name": 'regulate',
                "label": 'Regulate',
            },
            "substrate": {
                "name": 'substrate',
                "label": 'Substrate',
            }
        }
    },
    "displaySection": {
        "gp": {
            id: "gp",
            label: 'Gene Product'
        },
        "fd": {
            id: "fd",
            label: 'Macromolecular Complex'
        },
    },
    "displayGroup": {
        "gp": {
            id: "gp",
            shorthand: "GP",
            label: 'Gene Product'
        },
        "mc": {
            id: "mc",
            shorthand: "MC",
            label: 'Macromolecular Complex'
        },
        "mf": {
            id: "mf",
            shorthand: "MF",
            label: 'Molecular Function'
        },
        "bp": {
            id: "bp",
            shorthand: "BP",
            label: 'Biological Process'
        },
        "cc": {
            id: "cc",
            shorthand: "CC",
            label: 'Location of Activity'
        }
    },
    edge: edge,
    noDuplicateEdges: [
        'RO:0002333',
        'RO:0002092',
        'BFO:0000066',
        'BFO:0000050'
    ],
    canDuplicateEdges: [{
        label: 'hasPart',
        id: 'BFO:0000051'
    }],
    evidenceAutoPopulate: {
        nd: {
            evidence: {
                'id': 'ECO:0000307',
                'label': 'no biological data found used in manual assertion'
            },
            reference: 'GO_REF:0000015'
        }
    },
    rootNode: {
        mf: {
            'id': 'GO:0003674',
            'label': 'molecular_function',
            'aspect': 'F'
        },
        bp: {
            'id': 'GO:0008150',
            'label': 'biological_process',
            'aspect': 'P'
        },
        cc: {
            'id': 'GO:0005575',
            'label': 'cellular_component',
            'aspect': 'C'
        }
    },

    closures: {
        mf: {
            'id': 'GO:0003674',
        },
        bp: {
            'id': 'GO:0008150',
        },
        cc: {
            'id': 'GO:0005575',
        },
        gp: {
            'id': 'CHEBI:33695',
        },
        gpHasInput: {
            'id': 'CHEBI:23367',
        },
        mc: {
            'id': 'GO:0032991'
        },
        tp: {
            'id': 'GO:0044848'
        },
        cl: {
            'id': 'CL:0000003'
        },
        ub: {
            'id': 'UBERON:0000061'
        },
        catalyticActivity: {
            'id': 'GO:0003824'
        }
    },

    causalEdges: [
        edge.causallyUpstreamOf,
        edge.causallyUpstreamOfNegativeEffect,
        edge.causallyUpstreamOfPositiveEffect,
        edge.directlyRegulates,
        edge.directlyPositivelyRegulates,
        edge.directlyNegativelyRegulates,
        edge.directlyProvidesInput,
        edge.positivelyRegulates,
        edge.negativelyRegulates,
        edge.regulates
    ],

    connectorProcesses: [{
        id: 'GO:0006351',
        label: 'transcription, DNA templated',
        edge: edge.causallyUpstreamOfPositiveEffect
    }, {
        id: 'GO:0006511',
        label: 'ubiquitin-dependent protein catabolic process',
        edge: edge.negativelyRegulates
    }, {
        id: 'GO:0031623',
        label: 'receptor internalization',
        edge: edge.negativelyRegulates
    }, {
        id: 'GO:0051170',
        label: 'nuclear import',
        edge: edge.positivelyRegulates
    }]
};
