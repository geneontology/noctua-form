import { noctuaFormConfig } from './../../noctua-form-config';
import { Entity, AnnotonNodeDisplay } from './../../models/annoton';
import * as EntityDefinition from './entity-definition';
import { AnnotonNodeType } from './../../models/annoton/annoton-node';

declare const require: any;

export enum CardinalityType {
    none = 'none',
    oneToOne = 'oneToOne',
    oneToMany = 'oneToMany',
}

export interface InsertNodeDescription {
    id: string;
    label: string;
    node: AnnotonNodeDisplay;
    predicate: Entity;
    cardinality: CardinalityType;
}

export const canInsertEntity = {
    [AnnotonNodeType.GoMolecularFunction]: [
        <InsertNodeDescription>{
            label: 'Add Has Input (GP/Chemical)',
            id: AnnotonNodeType.GoChemicalEntityHasInput,
            node: <AnnotonNodeDisplay>{
                category: EntityDefinition.GoChemicalEntity.category,
                type: AnnotonNodeType.GoChemicalEntityHasInput,
                label: 'Has Input (GP/Chemical)',
                relationship: noctuaFormConfig.edge.hasInput,
                displaySection: noctuaFormConfig.displaySection.fd,
                displayGroup: noctuaFormConfig.displayGroup.mf,
                treeLevel: 2,
                isExtension: true,
            },
            predicate: noctuaFormConfig.edge.hasInput,
            cardinality: CardinalityType.oneToMany
        },
        <InsertNodeDescription>{
            label: 'Add Has Output (GP/Chemical)',
            id: AnnotonNodeType.GoChemicalEntityHasOutput,
            node: <AnnotonNodeDisplay>{
                category: EntityDefinition.GoChemicalEntity.category,
                type: AnnotonNodeType.GoChemicalEntityHasOutput,
                label: 'Has Output (GP/Chemical)',
                relationship: noctuaFormConfig.edge.hasOutput,
                displaySection: noctuaFormConfig.displaySection.fd,
                displayGroup: noctuaFormConfig.displayGroup.mf,
                treeLevel: 2,
                isExtension: true,
            },
            predicate: noctuaFormConfig.edge.hasOutput,
            cardinality: CardinalityType.oneToMany
        },
        <InsertNodeDescription>{
            label: 'Add Happens During (Biological Phase)',
            id: AnnotonNodeType.GoBiologicalPhase,
            node: <AnnotonNodeDisplay>{
                category: EntityDefinition.GoBiologicalPhase.category,
                type: AnnotonNodeType.GoBiologicalPhase,
                label: 'Happens During (Temporal Phase)',
                relationship: noctuaFormConfig.edge.happensDuring,
                displaySection: noctuaFormConfig.displaySection.fd,
                displayGroup: noctuaFormConfig.displayGroup.mf,
                treeLevel: 2,
                isExtension: true,
            },
            predicate: noctuaFormConfig.edge.happensDuring,
            cardinality: CardinalityType.oneToOne
        }
    ],
    [AnnotonNodeType.GoBiologicalProcess]: [
        <InsertNodeDescription>{
            label: 'Add Part Of (Biological Process)',
            id: AnnotonNodeType.GoBiologicalProcess,
            node: <AnnotonNodeDisplay>{
                category: EntityDefinition.GoBiologicalProcess.category,
                type: AnnotonNodeType.GoBiologicalProcess,
                label: 'Part Of (Biological Process)',
                aspect: 'P',
                relationship: noctuaFormConfig.edge.partOf,
                displaySection: noctuaFormConfig.displaySection.fd,
                displayGroup: noctuaFormConfig.displayGroup.bp,
                treeLevel: 3,
                isExtension: true,
            },
            predicate: noctuaFormConfig.edge.partOf,
            cardinality: CardinalityType.oneToOne
        },
    ],
    [AnnotonNodeType.GoCellularComponent]: [
        <InsertNodeDescription>{
            label: 'Add Part Of (Cellular Component)',
            id: AnnotonNodeType.GoCellularComponent,
            node: <AnnotonNodeDisplay>{
                category: EntityDefinition.GoCellularComponent.category,
                type: AnnotonNodeType.GoCellularComponent,
                aspect: 'C',
                label: 'Part Of Cellular Component',
                relationship: noctuaFormConfig.edge.partOf,
                displaySection: noctuaFormConfig.displaySection.fd,
                displayGroup: noctuaFormConfig.displayGroup.cc,
                treeLevel: 3,
                isExtension: true,
            },
            predicate: noctuaFormConfig.edge.partOf,
            cardinality: CardinalityType.oneToOne
        },
        <InsertNodeDescription>{
            label: 'Add Part Of (Cell Type)',
            id: AnnotonNodeType.GoCellTypeEntity,
            node: <AnnotonNodeDisplay>{
                category: EntityDefinition.GoCellTypeEntity.category,
                type: AnnotonNodeType.GoCellTypeEntity,
                label: 'Part Of (Cell Type)',
                relationship: noctuaFormConfig.edge.partOf,
                displaySection: noctuaFormConfig.displaySection.fd,
                displayGroup: noctuaFormConfig.displayGroup.cc,
                treeLevel: 3,
                isExtension: true,
            },
            predicate: noctuaFormConfig.edge.partOf,
            cardinality: CardinalityType.oneToOne
        },
        <InsertNodeDescription>{
            label: 'Add Part Of (Anatomy)',
            id: AnnotonNodeType.GoAnatomicalEntity,
            node: <AnnotonNodeDisplay>{
                category: EntityDefinition.GoAnatomicalEntity.category,
                type: AnnotonNodeType.GoAnatomicalEntity,
                label: 'Part Of (Anatomy)',
                relationship: noctuaFormConfig.edge.partOf,
                displaySection: noctuaFormConfig.displaySection.fd,
                displayGroup: noctuaFormConfig.displayGroup.cc,
                treeLevel: 3,
                isExtension: true,
            },
            predicate: noctuaFormConfig.edge.partOf,
            cardinality: CardinalityType.oneToOne
        },
        <InsertNodeDescription>{
            label: 'Add Part Of (Organism)',
            id: AnnotonNodeType.GoOrganism,
            node: <AnnotonNodeDisplay>{
                category: EntityDefinition.GoOrganism.category,
                type: AnnotonNodeType.GoOrganism,
                label: 'Part Of (Organism)',
                relationship: noctuaFormConfig.edge.partOf,
                displaySection: noctuaFormConfig.displaySection.fd,
                displayGroup: noctuaFormConfig.displayGroup.cc,
                treeLevel: 3,
                isExtension: true,
            },
            predicate: noctuaFormConfig.edge.partOf,
            cardinality: CardinalityType.oneToOne
        }
    ],
    [AnnotonNodeType.GoCellTypeEntity]: [
        <InsertNodeDescription>{
            label: 'Add Part Of (Anatomy)',
            id: AnnotonNodeType.GoAnatomicalEntity,
            node: <AnnotonNodeDisplay>{
                category: EntityDefinition.GoAnatomicalEntity.category,
                type: AnnotonNodeType.GoAnatomicalEntity,
                label: 'Part Of (Anatomy)',
                relationship: noctuaFormConfig.edge.partOf,
                displaySection: noctuaFormConfig.displaySection.fd,
                displayGroup: noctuaFormConfig.displayGroup.cc,
                treeLevel: 4,
                isExtension: true,
            },
            predicate: noctuaFormConfig.edge.partOf,
            cardinality: CardinalityType.oneToOne
        },
        <InsertNodeDescription>{
            label: 'Add Part Of (Organism)',
            id: AnnotonNodeType.GoOrganism,
            node: <AnnotonNodeDisplay>{
                category: EntityDefinition.GoOrganism.category,
                type: AnnotonNodeType.GoOrganism,
                label: 'Part Of (Organism)',
                relationship: noctuaFormConfig.edge.partOf,
                displaySection: noctuaFormConfig.displaySection.fd,
                displayGroup: noctuaFormConfig.displayGroup.cc,
                treeLevel: 4,
                isExtension: true,
            },
            predicate: noctuaFormConfig.edge.partOf,
            cardinality: CardinalityType.oneToOne
        }
    ],
    [AnnotonNodeType.GoAnatomicalEntity]: [
        <InsertNodeDescription>{
            label: 'Add Part Of (Organism)',
            id: AnnotonNodeType.GoOrganism,
            node: <AnnotonNodeDisplay>{
                category: EntityDefinition.GoOrganism.category,
                type: AnnotonNodeType.GoOrganism,
                label: 'Part Of (Organism)',
                relationship: noctuaFormConfig.edge.partOf,
                displaySection: noctuaFormConfig.displaySection.fd,
                displayGroup: noctuaFormConfig.displayGroup.cc,
                treeLevel: 5,
                isExtension: true,
            },
            predicate: noctuaFormConfig.edge.partOf,
            cardinality: CardinalityType.oneToOne
        }
    ]
};


