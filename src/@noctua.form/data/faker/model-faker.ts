/* import { noctuaFormConfig } from './../../noctua-form-config';
import { AnnotonNode, EntityLookup, Predicate, Annoton, Entity, AnnotonType, AnnotonNodeDisplay, EntityBase } from './../../models/annoton';
import * as EntityDefinition from './entity-definition';
import { each } from 'lodash';


const fakerData = {
    GoMolecularEntity: [
        <EntityBase>{
            id: 'UniProtKB:O95477',
            label: 'ABCA1 Hsap (UniProtKB:O95477)'
        }
    ],
    GoCellularComponent: [
        <EntityBase>{
            id: 'UniProtKB:O95477',
            label: 'ABCA1 Hsap (UniProtKB:O95477)'
        }
    ],
    GoBiologicalProcess: [
        <EntityBase>{
            id: 'UniProtKB:O95477',
            label: 'ABCA1 Hsap (UniProtKB:O95477)'
        }
    ],
    GoMolecularFunction: [
        <EntityBase>{
            id: 'UniProtKB:O95477',
            label: 'ABCA1 Hsap (UniProtKB:O95477)'
        }
    ],
    GoChemicalEntity: [
        <EntityBase>{
            id: 'UniProtKB:P02649',
            label: 'APOE Hsap (UniProtKB:P02649)'
        }
    ],
    GoEvidence: [
        <EntityBase>{
            id: 'ECO:0000314',
            label: 'direct assay evidence used in manual assertion (ECO:0000314)'
        }
    ],
    GoCellTypeEntity: [
        <EntityBase>{
            id: 'UniProtKB:O95477',
            label: 'ABCA1 Hsap (UniProtKB:O95477)'
        }
    ],
    GoAnatomicalEntity: [
        <EntityBase>{
            id: 'UniProtKB:O95477',
            label: 'ABCA1 Hsap (UniProtKB:O95477)'
        }
    ],
    GoOrganism: [
        <EntityBase>{
            id: 'UniProtKB:O95477',
            label: 'ABCA1 Hsap (UniProtKB:O95477)'
        }
    ],
    GoBiologicalPhase: [
        <EntityBase>{

        }
    ],

    export const noctuaFormExample = {
        basic:
            [{
                name: 'ABCA1 Hsap',
                annoton: [{
                    id: 'gp',
              < EntityBase > {
                        id: 'UniProtKB:O95477',
                        label: 'ABCA1 Hsap (UniProtKB:O95477)'
                    },
                    'evidence': [
                    {
                        'evidence': {
                            id: 'ECO:0000314',
                            label: 'direct assay evidence used in manual assertion (ECO:0000314)'
                        },
                        'reference': 'PMID:1234',
                        'with': 'PMID:123445'
                    }
                ]
            },
            {
                id: 'mf',
             ,
                'evidence': [
                {
                    'evidence': {
                        id: 'ECO:0000314',
                        label: 'direct assay evidence used in manual assertion (ECO:0000314)'
                    },
                    'reference': 'PMID:1234',
                    'with': 'PMID:123445'
                }
            ]
            },
            {
    id: 'mf-1',
        <EntityBase>{
            id: 'UniProtKB:P02649',
            label: 'APOE Hsap (UniProtKB:P02649)'
        },
        'evidence': [
            {
                'evidence': {
                    id: 'ECO:0000314',
                    label: 'direct assay evidence used in manual assertion (ECO:0000314)'
                },
                'reference': 'PMID:1234',
                'with': 'PMID:12'
            }
        ]
},
{
    id: 'mf-2',
        <EntityBase>{
            id: 'GO:0000279',
            label: 'M phase (GO:0000279)'
        },
        'evidence': [
            {
                'evidence': {
                    id: 'ECO:0000314',
                    label: 'direct assay evidence used in manual assertion (ECO:0000314)'
                },
                'reference': 'PMID:1234',
                'with': 'PMID:1234'
            }
        ]
},
{
    id: 'bp',
        <EntityBase>{
            id: 'GO:0006869',
            label: 'lipid transport (GO:0006869)'
        },
        'evidence': [
            {
                'evidence': {
                    id: 'ECO:0000314',
                    label: 'direct assay evidence used in manual assertion (ECO:0000314)'
                },
                'reference': 'PMID:12345',
                'with': ''
            }
        ]
},
{
    id: 'bp-1',
        <EntityBase>{
            id: 'GO:0042632',
            label: 'cholesterol homeostasis (GO:0042632)'
        },
        'evidence': [
            {
                'evidence': {
                    id: 'ECO:0000314',
                    label: 'direct assay evidence used in manual assertion (ECO:0000314)'
                },
                'reference': 'PMID:123456',
                'with': 'PMID:1234|PMID:1444'
            }
        ]
},
{
    id: 'bp-1-1',
        <EntityBase>{
            id: 'GO:0003013',
            label: 'circulatory system process (GO:0003013)'
        },
        'evidence': [
            {
                'evidence': {
                    id: 'ECO:0000314',
                    label: 'direct assay evidence used in manual assertion (ECO:0000314)'
                },
                'reference': 'PMID:1234567',
                'with': 'PMID:12,PMID:444'
            }
        ]
},
{
    id: 'cc',
        <EntityBase>{
            id: 'GO:0005886',
            label: 'plasma membrane (GO:0005886)'
        },
        'evidence': [
            {
                'evidence': {
                    id: 'ECO:0000314',
                    label: 'direct assay evidence used in manual assertion (ECO:0000314)'
                },
                'reference': 'PMID:1234',
                'with': 'PMID:1234'
            }
        ]
},
{
    id: 'cc-1',
        <EntityBase>{
            id: 'GO:0005886',
            label: 'plasma membrane (GO:0005886)'
        },
        'evidence': [
            {
                'evidence': {
                    id: 'ECO:0000314',
                    label: 'direct assay evidence used in manual assertion (ECO:0000314)'
                },
                'reference': 'PMID:1234',
                'with': ''
            }
        ]
},
{
    id: 'cc-1-1',
        <EntityBase>{
            id: 'CL:2000054',
            label: 'hepatic pit cell (CL:2000054)'
        },
        'evidence': [
            {
                'evidence': {
                    id: 'ECO:0000314',
                    label: 'direct assay evidence used in manual assertion (ECO:0000314)'
                },
                'reference': 'PMID:1234',
                'with': 'PMID:12344444'
            }
        ]
},
{
    id: 'cc-1-1-1',
        <EntityBase>{
            id: 'UBERON:0002107',
            label: 'liver (UBERON:0002107)'
        },
        'evidence': [
            {
                'evidence': {
                    id: 'ECO:0000314',
                    label: 'direct assay evidence used in manual assertion (ECO:0000314)'
                },
                'reference': 'PMID:1234',
                'with': 'PMID:12344777'
            }
        ]
},
            ]
          },


{
    name: 'RBBP8 Hsap',
        annoton: [
            {
                id: 'gp',
                < EntityBase > {
                id: 'UniProtKB:Q99708',
                label: 'RBBP8 Hsap (UniProtKB:Q99708)'
            },
              },
{
    id: 'mf',
        <EntityBase>{
            id: 'GO:0000014',
            label: 'single-stranded DNA endodeoxyribonuclease activity (GO:0000014)'
        },
        'evidence': [
            {
                'evidence': {
                    id: 'ECO:0000314',
                    label: 'direct assay evidence used in manual assertion (ECO:0000314)'
                },
                'reference': 'PMID:26502055',
                'with': ''
            }
        ]
},
{
    id: 'cc',
        <EntityBase>{
            id: 'GO:0000785',
            label: 'chromatin (GO:0000785)'
        },
        'evidence': [
            {
                'evidence': {
                    id: 'ECO:0000314',
                    label: 'direct assay evidence used in manual assertion (ECO:0000314)'
                },
                'reference': 'PMID:26502055',
                'with': ''
            }
        ]
}
            ]
          }, {
    name: 'RNF138 Hsap',
        annoton: [
            {
                id: 'gp',
                < EntityBase > {
                id: 'UniProtKB:Q8WVD3',
                label: 'RNF138 Hsap (UniProtKB:Q8WVD3)'
            }
              },
{
    id: 'mf',
        <EntityBase>{
            id: 'GO:0003697',
            label: 'single-stranded DNA binding (GO:0003697)'
        },
        'evidence': [
            {
                'evidence': {
                    id: 'ECO:0000314',
                    label: 'direct assay evidence used in manual assertion (ECO:0000314)'
                },
                'reference': 'PMID:26502055',
                'with': ''
            }
        ]
},
{
    id: 'bp',
        <EntityBase>{
            id: 'GO:0006974',
            label: 'cellular response to DNA damage stimulus (GO:0006974)'
        },
        'evidence': [
            {
                'evidence': {
                    id: 'ECO:0000314',
                    label: 'direct assay evidence used in manual assertion (ECO:0000314)'
                },
                'reference': 'PMID:26502055',
                'with': ''
            }
        ]
},
            ]
          }]
      };

]

export const bpOnlyAnnotation: ActivityDescription = {
    type: AnnotonType.bpOnly,
    nodes: [
        EntityDefinition.generateMolecularFunction,
        EntityDefinition.generateMolecularEntity,
        EntityDefinition.generateBiologicalProcess,
        EntityDefinition.generateCellTypeEntity,
        EntityDefinition.generateAnatomicalEntity,
        EntityDefinition.generateOrganism
    ],
    triples: [{
        subject: EntityDefinition.annotonNodeType.GoMolecularFunction,
        object: EntityDefinition.annotonNodeType.GoMolecularEntity,
        predicate: noctuaFormConfig.edge.enabledBy
    }, {
        subject: EntityDefinition.annotonNodeType.GoMolecularFunction,
        object: EntityDefinition.annotonNodeType.GoBiologicalProcess,
        predicate: noctuaFormConfig.edge.causallyUpstreamOfOrWithin
    }, {
        subject: EntityDefinition.annotonNodeType.GoMolecularFunction,
        object: EntityDefinition.annotonNodeType.GoCellTypeEntity,
        predicate: noctuaFormConfig.edge.occursIn
    }, {
        subject: EntityDefinition.annotonNodeType.GoCellTypeEntity,
        object: EntityDefinition.annotonNodeType.GoAnatomicalEntity,
        predicate: noctuaFormConfig.edge.partOf
    }, {
        subject: EntityDefinition.annotonNodeType.GoAnatomicalEntity,
        object: EntityDefinition.annotonNodeType.GoOrganism,
        predicate: noctuaFormConfig.edge.partOf
    }],
    overrides: {
        [EntityDefinition.annotonNodeType.GoMolecularFunction]: <AnnotonNodeDisplay>{
            displaySection: '',
            displayGroup: '',
        },
        [EntityDefinition.annotonNodeType.GoBiologicalProcess]: <AnnotonNodeDisplay>{
            label: 'Biological Process',
            treeLevel: 2
        },
        [EntityDefinition.annotonNodeType.GoCellTypeEntity]: <AnnotonNodeDisplay>{
            label: 'occurs in (Cell Type)',
            relationship: noctuaFormConfig.edge.occursIn,
            treeLevel: 3
        },
        [EntityDefinition.annotonNodeType.GoAnatomicalEntity]: <AnnotonNodeDisplay>{
            treeLevel: 4
        },
        [EntityDefinition.annotonNodeType.GoOrganism]: <AnnotonNodeDisplay>{
            treeLevel: 5
        }
    }
};

export const ccOnlyAnnotation: ActivityDescription = {
    type: AnnotonType.ccOnly,
    nodes: [
        EntityDefinition.generateMolecularEntity,
        EntityDefinition.generateCellularComponent,
        EntityDefinition.generateCellTypeEntity,
        EntityDefinition.generateAnatomicalEntity,
        EntityDefinition.generateOrganism
    ],
    triples: [{
        subject: EntityDefinition.annotonNodeType.GoMolecularEntity,
        object: EntityDefinition.annotonNodeType.GoCellularComponent,
        predicate: noctuaFormConfig.edge.enabledBy
    }, {
        subject: EntityDefinition.annotonNodeType.GoCellularComponent,
        object: EntityDefinition.annotonNodeType.GoCellTypeEntity,
        predicate: noctuaFormConfig.edge.partOf
    }, {
        subject: EntityDefinition.annotonNodeType.GoCellTypeEntity,
        object: EntityDefinition.annotonNodeType.GoAnatomicalEntity,
        predicate: noctuaFormConfig.edge.partOf
    }, {
        subject: EntityDefinition.annotonNodeType.GoAnatomicalEntity,
        object: EntityDefinition.annotonNodeType.GoOrganism,
        predicate: noctuaFormConfig.edge.partOf
    }],
    overrides: {
        [EntityDefinition.annotonNodeType.GoCellularComponent]: <AnnotonNodeDisplay>{
            label: 'GP located in Cellular Component',
            relationship: noctuaFormConfig.edge.locatedIn,
            treeLevel: 2
        },
        [EntityDefinition.annotonNodeType.GoCellTypeEntity]: <AnnotonNodeDisplay>{
            relationship: noctuaFormConfig.edge.occursIn,
            treeLevel: 3
        },
        [EntityDefinition.annotonNodeType.GoAnatomicalEntity]: <AnnotonNodeDisplay>{
            treeLevel: 4
        },
        [EntityDefinition.annotonNodeType.GoOrganism]: <AnnotonNodeDisplay>{
            treeLevel: 5
        }
    }
};

export const createActivity = (activityDescription: ActivityDescription): Annoton => {
    const self = this;
    const annoton = new Annoton();

    annoton.annotonType = activityDescription.type;

    each(activityDescription.nodes, (nodeFn) => {
        annoton.addNode(nodeFn.call(self));
    });

    each(activityDescription.overrides, (override: AnnotonNodeDisplay, key: EntityDefinition.annotonNodeType) => {
        const node: AnnotonNode = annoton.getNode(key);
        node.overrideValues(override);
    });

    each(activityDescription.triples, (triple) => {
        const predicate: Predicate = annoton.getNode(triple.object).predicate;

        predicate.edge = Entity.createEntity(triple.predicate);
        annoton.addEdgeById(triple.subject, triple.object, predicate);
    });

    const startNode = annoton.getNode(activityDescription.triples[0].subject);
    const startTriple = annoton.getEdge(
        activityDescription.triples[0].subject,
        activityDescription.triples[0].object);

    startNode.predicate = startTriple.predicate;

    annoton.enableSubmit();
    return annoton;
}
 */