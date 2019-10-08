import { noctuaFormConfig } from './../../noctua-form-config';
import { AnnotonNode, EntityLookup, Predicate, Annoton, Entity, AnnotonType, AnnotonNodeDisplay } from './../../models/annoton';
import * as EntityDefinition from './entity-definition';
import * as InsertEntityDefinition from './insert-entity-definition';
import { each } from 'lodash';
import { AnnotonNodeType } from './../../models/annoton/annoton-node';

declare const require: any;
const getUuid = require('uuid/v1');

export interface ActivityDescription {
    type: AnnotonType;
    nodes: { [key: string]: AnnotonNodeDisplay };
    triples: { subject: string, object: string, predicate: any }[];
    overrides?: { [key: string]: AnnotonNodeDisplay };
}

export interface InsertNodeDescription {
    node: AnnotonNodeDisplay;
    predicate: Entity;
}

export const activityUnitDescription: ActivityDescription = {
    type: AnnotonType.default,
    nodes: {
        [AnnotonNodeType.GoMolecularFunction]: <AnnotonNodeDisplay>{
            id: EntityDefinition.GoMolecularFunction.id,
            type: AnnotonNodeType.GoMolecularFunction,
            category: EntityDefinition.GoMolecularFunction.category,
            label: 'Molecular Function',
            aspect: 'F',
            relationship: noctuaFormConfig.edge.enabledBy,
            displaySection: noctuaFormConfig.displaySection.fd,
            displayGroup: noctuaFormConfig.displayGroup.mf,
            termRequired: true
        },
        [AnnotonNodeType.GoMolecularEntity]: <AnnotonNodeDisplay>{
            id: EntityDefinition.GoMolecularEntity.id,
            type: AnnotonNodeType.GoMolecularEntity,
            category: EntityDefinition.GoMolecularEntity.category,
            label: 'Gene Product',
            skipEvidence: true,
            relationship: noctuaFormConfig.edge.enabledBy,
            displaySection: noctuaFormConfig.displaySection.gp,
            displayGroup: noctuaFormConfig.displayGroup.gp,
            termRequired: true
        },
        [AnnotonNodeType.GoBiologicalProcess]: <AnnotonNodeDisplay>{
            id: EntityDefinition.GoBiologicalProcess.id,
            type: AnnotonNodeType.GoBiologicalProcess,
            category: EntityDefinition.GoBiologicalProcess.category,
            label: 'MF part of Biological Process',
            aspect: 'P',
            relationship: noctuaFormConfig.edge.partOf,
            displaySection: noctuaFormConfig.displaySection.fd,
            displayGroup: noctuaFormConfig.displayGroup.bp,
            treeLevel: 2,
        },
        [AnnotonNodeType.GoCellularComponent]: <AnnotonNodeDisplay>{
            id: EntityDefinition.GoCellularComponent.id,
            type: AnnotonNodeType.GoCellularComponent,
            category: EntityDefinition.GoCellularComponent.category,
            label: 'MF occurs in Cellular Component',
            aspect: 'C',
            relationship: noctuaFormConfig.edge.occursIn,
            displaySection: noctuaFormConfig.displaySection.fd,
            displayGroup: noctuaFormConfig.displayGroup.cc,
            treeLevel: 2,
        }
    },
    triples: [{
        subject: AnnotonNodeType.GoMolecularFunction,
        object: AnnotonNodeType.GoMolecularEntity,
        predicate: noctuaFormConfig.edge.enabledBy
    }, {
        subject: AnnotonNodeType.GoMolecularFunction,
        object: AnnotonNodeType.GoBiologicalProcess,
        predicate: noctuaFormConfig.edge.partOf
    }, {
        subject: AnnotonNodeType.GoMolecularFunction,
        object: AnnotonNodeType.GoCellularComponent,
        predicate: noctuaFormConfig.edge.occursIn
    }],
};

export const bpOnlyAnnotationDescription: ActivityDescription = {
    type: AnnotonType.bpOnly,
    nodes: {
        [AnnotonNodeType.GoMolecularFunction]: <AnnotonNodeDisplay>{
            id: EntityDefinition.GoMolecularFunction.id,
            type: AnnotonNodeType.GoMolecularFunction,
            category: EntityDefinition.GoMolecularFunction.category,
            label: 'Molecular Function',
            aspect: 'F',
            relationship: noctuaFormConfig.edge.enabledBy,
            displaySection: noctuaFormConfig.displaySection.fd,
            displayGroup: noctuaFormConfig.displayGroup.mf,
            visible: false
        },
        [AnnotonNodeType.GoMolecularEntity]: <AnnotonNodeDisplay>{
            id: EntityDefinition.GoMolecularEntity.id,
            type: AnnotonNodeType.GoMolecularEntity,
            category: EntityDefinition.GoMolecularEntity.category,
            label: 'Gene Product',
            skipEvidence: true,
            relationship: noctuaFormConfig.edge.enabledBy,
            displaySection: noctuaFormConfig.displaySection.gp,
            displayGroup: noctuaFormConfig.displayGroup.gp,
            termRequired: true
        },

        [AnnotonNodeType.GoBiologicalProcess]: <AnnotonNodeDisplay>{
            id: EntityDefinition.GoBiologicalProcess.id,
            type: AnnotonNodeType.GoBiologicalProcess,
            category: EntityDefinition.GoBiologicalProcess.category,
            label: 'Biological Process',
            aspect: 'P',
            relationship: noctuaFormConfig.edge.causallyUpstreamOfOrWithin,
            displaySection: noctuaFormConfig.displaySection.fd,
            displayGroup: noctuaFormConfig.displayGroup.bp,
            treeLevel: 2,
            termRequired: true
        },
        [AnnotonNodeType.GoCellularComponent]: <AnnotonNodeDisplay>{
            id: EntityDefinition.GoCellularComponent.id,
            type: AnnotonNodeType.GoCellularComponent,
            category: EntityDefinition.GoCellularComponent.category,
            label: 'occurs in Cellular Component',
            aspect: 'C',
            relationship: noctuaFormConfig.edge.occursIn,
            displaySection: noctuaFormConfig.displaySection.fd,
            displayGroup: noctuaFormConfig.displayGroup.cc,
            treeLevel: 3,
        }
    },
    triples: [{
        subject: AnnotonNodeType.GoMolecularFunction,
        object: AnnotonNodeType.GoMolecularEntity,
        predicate: noctuaFormConfig.edge.enabledBy
    }, {
        subject: AnnotonNodeType.GoMolecularFunction,
        object: AnnotonNodeType.GoBiologicalProcess,
        predicate: noctuaFormConfig.edge.causallyUpstreamOfOrWithin
    }, {
        subject: AnnotonNodeType.GoBiologicalProcess,
        object: AnnotonNodeType.GoCellularComponent,
        predicate: noctuaFormConfig.edge.occursIn
    }],
    overrides: {
        [AnnotonNodeType.GoBiologicalProcess]: <AnnotonNodeDisplay>{
            label: 'Biological Process',
            treeLevel: 2
        },
        [AnnotonNodeType.GoCellularComponent]: <AnnotonNodeDisplay>{
            treeLevel: 3
        }
    }
};

export const ccOnlyAnnotationDescription: ActivityDescription = {
    type: AnnotonType.ccOnly,
    nodes: {
        [AnnotonNodeType.GoMolecularEntity]: <AnnotonNodeDisplay>{
            id: EntityDefinition.GoMolecularEntity.id,
            type: AnnotonNodeType.GoMolecularEntity,
            category: EntityDefinition.GoMolecularEntity.category,
            label: 'Gene Product',
            skipEvidence: true,
            relationship: noctuaFormConfig.edge.enabledBy,
            displaySection: noctuaFormConfig.displaySection.gp,
            displayGroup: noctuaFormConfig.displayGroup.gp,
        },
        [AnnotonNodeType.GoCellularComponent]: <AnnotonNodeDisplay>{
            id: EntityDefinition.GoCellularComponent.id,
            type: AnnotonNodeType.GoCellularComponent,
            category: EntityDefinition.GoCellularComponent.category,
            aspect: 'C',
            label: 'Located In Cellular Component',
            relationship: noctuaFormConfig.edge.locatedIn,
            displaySection: noctuaFormConfig.displaySection.fd,
            displayGroup: noctuaFormConfig.displayGroup.cc,
            treeLevel: 2,
        }
    },
    triples: [{
        subject: AnnotonNodeType.GoMolecularEntity,
        object: AnnotonNodeType.GoCellularComponent,
        predicate: noctuaFormConfig.edge.locatedIn
    }],
};


export const createActivity = (activityDescription: ActivityDescription): Annoton => {
    const self = this;
    const annoton = new Annoton();

    annoton.annotonType = activityDescription.type;

    each(activityDescription.nodes, (node: AnnotonNodeDisplay) => {
        const annotonNode = EntityDefinition.generateBaseTerm(node.category, node);
        annoton.addNode(annotonNode);
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

    annoton.updateEntityInsertMenu();
    annoton.enableSubmit();
    return annoton;
};

export const insertNode = (annoton: Annoton, subjectNode: AnnotonNode, nodeDescription: InsertNodeDescription): AnnotonNode => {
    const objectNode = EntityDefinition.generateBaseTerm(nodeDescription.node.category, nodeDescription.node);

    objectNode.id = `${nodeDescription.node.type}'@@'${getUuid()}`;
    objectNode.type = nodeDescription.node.type;

    annoton.addNode(objectNode);

    const predicate: Predicate = annoton.getNode(objectNode.id).predicate;
    predicate.edge = Entity.createEntity(nodeDescription.predicate);

    annoton.updateEdges(subjectNode, objectNode, predicate);

    annoton.resetPresentation();
    return objectNode;
};



