import { noctuaFormConfig } from './../../noctua-form-config';

import * as EntityDefinition from './entity-definition';
import * as ShapeDescription from './../../data/config/shape-definition';
import { each, } from 'lodash';
import { ActivityNodeType, ActivityNodeDisplay, ActivityNode, GoCategory } from './../../models/activity/activity-node';
import { Entity } from '../../models/activity/entity';
import { Predicate } from '../../models/activity/predicate';
import { ActivityType, Activity } from '../../models/activity/activity';
import { v4 as uuid } from 'uuid';
import shexJson from './../shapes.json'
import shapeTerms from './../shape-terms.json'
import { DataUtils } from './data-utils';
import { ShexShapeAssociation } from '../shape';


export interface ActivityDescription {
    type: ActivityType;
    isComplex?: boolean;
    nodes: { [key: string]: ActivityNodeDisplay };
    triples: { subject: string, object: string, predicate: any }[];
    overrides?: { [key: string]: ActivityNodeDisplay };
}

export interface InsertNodeDescription {
    node: ActivityNodeDisplay;
    predicate: Entity;
}

const getNodeDefaults = (subjectNode: ActivityNode, predExpr: ShapeDescription.PredicateExpression, ranges: GoCategory[]) => {
    const node = {
        type: ActivityNodeType.GoMolecularEntity,
        category: ranges,
        label: predExpr.label,
        canDelete: true,
        displaySection: subjectNode.displaySection,
        displayGroup: subjectNode.displayGroup,
        weight: subjectNode.weight + 2
    } as ActivityNodeDisplay

    return node
}

export const activityUnitBaseDescription: ActivityDescription = {
    type: ActivityType.default,
    nodes: {
        [ActivityNodeType.GoMolecularFunction]: <ActivityNodeDisplay>{
            id: EntityDefinition.GoMolecularFunction.id,
            type: ActivityNodeType.GoMolecularFunction,
            category: [EntityDefinition.GoMolecularFunction],
            label: 'Molecular Function',
            aspect: 'F',
            displaySection: noctuaFormConfig.displaySection.fd,
            displayGroup: noctuaFormConfig.displayGroup.mf,
            skipEvidenceCheck: true,
            canDelete: false,
            termRequired: true,
            weight: 1
        },
    },
    triples: [],
};

export const bpOnlyAnnotationBaseDescription: ActivityDescription = {
    type: ActivityType.bpOnly,
    isComplex: true,
    nodes: {
        [ActivityNodeType.GoMolecularFunction]: <ActivityNodeDisplay>{
            id: EntityDefinition.GoMolecularFunction.id,
            type: ActivityNodeType.GoMolecularFunction,
            category: [EntityDefinition.GoMolecularFunction],
            label: 'Molecular Function',
            aspect: 'F',
            displaySection: noctuaFormConfig.displaySection.fd,
            displayGroup: noctuaFormConfig.displayGroup.mf,
            skipEvidenceCheck: true,
            visible: false,
            canDelete: false,
            weight: 1
        }
    },
    triples: []
};

export const ccOnlyAnnotationBaseDescription: ActivityDescription = {
    type: ActivityType.ccOnly,
    nodes: {
        [ActivityNodeType.GoMolecularEntity]: <ActivityNodeDisplay>{
            id: EntityDefinition.GoMolecularEntity.id,
            type: ActivityNodeType.GoMolecularEntity,
            category: [EntityDefinition.GoMolecularEntity, EntityDefinition.GoProteinContainingComplex],
            label: 'Gene Product',
            skipEvidenceCheck: true,
            termRequired: true,
            canDelete: false,
            displaySection: noctuaFormConfig.displaySection.gp,
            displayGroup: noctuaFormConfig.displayGroup.gp,
            weight: 1
        }
    },
    triples: [],
};

export const proteinComplexBaseDescription: ActivityDescription = {
    type: ActivityType.proteinComplex,
    nodes: {
        [ActivityNodeType.GoMolecularFunction]: <ActivityNodeDisplay>{
            id: EntityDefinition.GoMolecularFunction.id,
            type: ActivityNodeType.GoMolecularFunction,
            category: [EntityDefinition.GoMolecularFunction],
            label: 'Molecular Function',
            aspect: 'F',
            displaySection: noctuaFormConfig.displaySection.fd,
            displayGroup: noctuaFormConfig.displayGroup.mf,
            skipEvidenceCheck: true,
            visible: false,
            canDelete: false,
            weight: 1
        }
    },
    triples: [],
};

export const moleculeBaseDescription: ActivityDescription = {
    type: ActivityType.molecule,
    nodes: {
        [ActivityNodeType.GoChemicalEntity]: <ActivityNodeDisplay>{
            id: EntityDefinition.GoChemicalEntity.id,
            type: ActivityNodeType.GoChemicalEntity,
            category: [EntityDefinition.GoChemicalEntity],
            label: 'Molecule',
            skipEvidenceCheck: true,
            showEvidence: false,
            termRequired: true,
            canDelete: false,
            displaySection: noctuaFormConfig.displaySection.gp,
            displayGroup: noctuaFormConfig.displayGroup.gp,
            weight: 1
        }
    },
    triples: [],
};


export const activityUnitDescription: ActivityDescription = {
    type: ActivityType.default,
    nodes: {
        [ActivityNodeType.GoMolecularFunction]: <ActivityNodeDisplay>{
            id: EntityDefinition.GoMolecularFunction.id,
            type: ActivityNodeType.GoMolecularFunction,
            category: [EntityDefinition.GoMolecularFunction],
            label: 'Molecular Function',
            aspect: 'F',
            displaySection: noctuaFormConfig.displaySection.fd,
            displayGroup: noctuaFormConfig.displayGroup.mf,
            termRequired: true,
            canDelete: false,
            weight: 1
        },
        [ActivityNodeType.GoMolecularEntity]: <ActivityNodeDisplay>{
            id: EntityDefinition.GoMolecularEntity.id,
            type: ActivityNodeType.GoMolecularEntity,
            category: [EntityDefinition.GoMolecularEntity, EntityDefinition.GoProteinContainingComplex],
            label: 'enabled by (GP)',
            displaySection: noctuaFormConfig.displaySection.gp,
            displayGroup: noctuaFormConfig.displayGroup.gp,
            termRequired: true,
            skipEvidenceCheck: true,
            canDelete: false,
            weight: 2
        },
        [ActivityNodeType.GoBiologicalProcess]: <ActivityNodeDisplay>{
            id: EntityDefinition.GoBiologicalProcess.id,
            type: ActivityNodeType.GoBiologicalProcess,
            category: [EntityDefinition.GoBiologicalProcess],
            label: '(MF) part of (BP)',
            aspect: 'P',
            displaySection: noctuaFormConfig.displaySection.fd,
            displayGroup: noctuaFormConfig.displayGroup.bp,
            weight: 10
        },
        [ActivityNodeType.GoCellularComponent]: <ActivityNodeDisplay>{
            id: EntityDefinition.GoCellularComponent.id,
            type: ActivityNodeType.GoCellularComponent,
            category: [EntityDefinition.GoCellularComponent],
            label: '(MF) occurs in (CC)',
            aspect: 'C',
            displaySection: noctuaFormConfig.displaySection.fd,
            displayGroup: noctuaFormConfig.displayGroup.cc,
            weight: 20
        }
    },
    triples: [{
        subject: ActivityNodeType.GoMolecularFunction,
        object: ActivityNodeType.GoMolecularEntity,
        predicate: noctuaFormConfig.edge.enabledBy
    }, {
        subject: ActivityNodeType.GoMolecularFunction,
        object: ActivityNodeType.GoBiologicalProcess,
        predicate: noctuaFormConfig.edge.partOf
    }, {
        subject: ActivityNodeType.GoMolecularFunction,
        object: ActivityNodeType.GoCellularComponent,
        predicate: noctuaFormConfig.edge.occursIn
    }],
};

export const bpOnlyAnnotationDescription: ActivityDescription = {
    type: ActivityType.bpOnly,
    nodes: {
        [ActivityNodeType.GoMolecularFunction]: <ActivityNodeDisplay>{
            id: EntityDefinition.GoMolecularFunction.id,
            type: ActivityNodeType.GoMolecularFunction,
            category: [EntityDefinition.GoMolecularFunction],
            label: 'Molecular Function',
            aspect: 'F',
            displaySection: noctuaFormConfig.displaySection.fd,
            displayGroup: noctuaFormConfig.displayGroup.mf,
            visible: false,
            canDelete: false,
            weight: 1
        },
        [ActivityNodeType.GoMolecularEntity]: <ActivityNodeDisplay>{
            id: EntityDefinition.GoMolecularEntity.id,
            type: ActivityNodeType.GoMolecularEntity,
            category: [EntityDefinition.GoMolecularEntity, EntityDefinition.GoProteinContainingComplex],
            label: 'enabled by (GP)',
            displaySection: noctuaFormConfig.displaySection.gp,
            displayGroup: noctuaFormConfig.displayGroup.gp,
            termRequired: true,
            skipEvidenceCheck: true,
            canDelete: false,
            weight: 2
        },

        [ActivityNodeType.GoBiologicalProcess]: <ActivityNodeDisplay>{
            id: EntityDefinition.GoBiologicalProcess.id,
            type: ActivityNodeType.GoBiologicalProcess,
            category: [EntityDefinition.GoBiologicalProcess],
            label: 'Biological Process',
            aspect: 'P',
            displaySection: noctuaFormConfig.displaySection.fd,
            displayGroup: noctuaFormConfig.displayGroup.bp,
            termRequired: true,
            weight: 10
        },
        [ActivityNodeType.GoCellularComponent]: <ActivityNodeDisplay>{
            id: EntityDefinition.GoCellularComponent.id,
            type: ActivityNodeType.GoCellularComponent,
            category: [EntityDefinition.GoCellularComponent],
            label: 'occurs in (CC)',
            aspect: 'C',
            displaySection: noctuaFormConfig.displaySection.fd,
            displayGroup: noctuaFormConfig.displayGroup.cc,
            weight: 20
        }
    },
    triples: [{
        subject: ActivityNodeType.GoMolecularFunction,
        object: ActivityNodeType.GoMolecularEntity,
        predicate: noctuaFormConfig.edge.enabledBy
    }, {
        subject: ActivityNodeType.GoMolecularFunction,
        object: ActivityNodeType.GoBiologicalProcess,
        predicate: noctuaFormConfig.edge.causallyUpstreamOfOrWithin
    }, {
        subject: ActivityNodeType.GoBiologicalProcess,
        object: ActivityNodeType.GoCellularComponent,
        predicate: noctuaFormConfig.edge.occursIn
    }],
    overrides: {
        [ActivityNodeType.GoBiologicalProcess]: <ActivityNodeDisplay>{
            label: 'Biological Process',

        },
        [ActivityNodeType.GoCellularComponent]: <ActivityNodeDisplay>{

        }
    }
};

export const ccOnlyAnnotationDescription: ActivityDescription = {
    type: ActivityType.ccOnly,
    nodes: {
        [ActivityNodeType.GoMolecularEntity]: <ActivityNodeDisplay>{
            id: EntityDefinition.GoMolecularEntity.id,
            type: ActivityNodeType.GoMolecularEntity,
            category: [EntityDefinition.GoMolecularEntity, EntityDefinition.GoProteinContainingComplex],
            label: 'Gene Product',
            skipEvidenceCheck: true,
            termRequired: true,
            canDelete: false,
            displaySection: noctuaFormConfig.displaySection.gp,
            displayGroup: noctuaFormConfig.displayGroup.gp,
            weight: 1
        },
        /*[ActivityNodeType.GoCellularComponent]: <ActivityNodeDisplay>{
            id: EntityDefinition.GoCellularComponent.id,
            type: ActivityNodeType.GoCellularComponent,
            category: [EntityDefinition.GoCellularComponent],
            aspect: 'C',
            termRequired: true,
            label: 'part of (CC)',
            displaySection: noctuaFormConfig.displaySection.fd,
            displayGroup: noctuaFormConfig.displayGroup.cc,

            weight: 2
        }*/
    },
    triples: [
        /*{
        subject: ActivityNodeType.GoMolecularEntity,
        object: ActivityNodeType.GoCellularComponent,
        predicate: noctuaFormConfig.edge.partOf
    }*/],
};

export const proteinComplexDescription: ActivityDescription = {
    type: ActivityType.proteinComplex,
    isComplex: true,
    nodes: {
        [ActivityNodeType.GoProteinContainingComplex]: <ActivityNodeDisplay>{
            id: EntityDefinition.GoProteinContainingComplex.id,
            type: ActivityNodeType.GoProteinContainingComplex,
            category: [EntityDefinition.GoProteinContainingComplex],
            label: 'Protein Complex',
            skipEvidenceCheck: true,
            termRequired: true,
            canDelete: false,
            displaySection: noctuaFormConfig.displaySection.gp,
            displayGroup: noctuaFormConfig.displayGroup.gp,
            weight: 2
        },
        [ActivityNodeType.GoMolecularFunction]: <ActivityNodeDisplay>{
            id: EntityDefinition.GoMolecularFunction.id,
            type: ActivityNodeType.GoMolecularFunction,
            category: [EntityDefinition.GoMolecularFunction],
            label: 'Molecular Function',
            aspect: 'F',
            displaySection: noctuaFormConfig.displaySection.fd,
            displayGroup: noctuaFormConfig.displayGroup.mf,
            termRequired: true,
            canDelete: false,
            weight: 1
        },
        [ActivityNodeType.GoBiologicalProcess]: <ActivityNodeDisplay>{
            id: EntityDefinition.GoBiologicalProcess.id,
            type: ActivityNodeType.GoBiologicalProcess,
            category: [EntityDefinition.GoBiologicalProcess],
            label: '(MF) part of (BP)',
            aspect: 'P',
            displaySection: noctuaFormConfig.displaySection.fd,
            displayGroup: noctuaFormConfig.displayGroup.bp,
            weight: 10
        },
        [ActivityNodeType.GoCellularComponent]: <ActivityNodeDisplay>{
            id: EntityDefinition.GoCellularComponent.id,
            type: ActivityNodeType.GoCellularComponent,
            category: [EntityDefinition.GoCellularComponent],
            label: '(MF) occurs in (CC)',
            aspect: 'C',
            displaySection: noctuaFormConfig.displaySection.fd,
            displayGroup: noctuaFormConfig.displayGroup.cc,
            weight: 20
        }
    },
    triples: [{
        subject: ActivityNodeType.GoMolecularFunction,
        object: ActivityNodeType.GoProteinContainingComplex,
        predicate: noctuaFormConfig.edge.enabledBy
    }, {
        subject: ActivityNodeType.GoMolecularFunction,
        object: ActivityNodeType.GoBiologicalProcess,
        predicate: noctuaFormConfig.edge.partOf
    }, {
        subject: ActivityNodeType.GoMolecularFunction,
        object: ActivityNodeType.GoCellularComponent,
        predicate: noctuaFormConfig.edge.occursIn
    }],
};

export const moleculeDescription: ActivityDescription = {
    type: ActivityType.molecule,
    nodes: {
        [ActivityNodeType.GoChemicalEntity]: <ActivityNodeDisplay>{
            id: EntityDefinition.GoChemicalEntity.id,
            type: ActivityNodeType.GoChemicalEntity,
            category: [EntityDefinition.GoChemicalEntity],
            label: 'Molecule',
            skipEvidenceCheck: true,
            termRequired: true,
            canDelete: false,
            displaySection: noctuaFormConfig.displaySection.gp,
            displayGroup: noctuaFormConfig.displayGroup.gp,
            weight: 1
        },
        [ActivityNodeType.GoCellularComponent]: <ActivityNodeDisplay>{
            id: EntityDefinition.GoCellularComponent.id,
            type: ActivityNodeType.GoCellularComponent,
            category: [EntityDefinition.GoCellularComponent],
            label: '(Chemical) located in (CC)',
            aspect: 'C',
            displaySection: noctuaFormConfig.displaySection.fd,
            displayGroup: noctuaFormConfig.displayGroup.cc,
            weight: 20
        }
    },
    triples: [{
        subject: ActivityNodeType.GoChemicalEntity,
        object: ActivityNodeType.GoCellularComponent,
        predicate: noctuaFormConfig.edge.locatedIn
    }],
};

export const createActivity = (activityDescription: ActivityDescription): Activity => {
    const self = this;
    const activity = new Activity();

    activity.activityType = activityDescription.type;

    each(activityDescription.nodes, (node: ActivityNodeDisplay) => {
        const activityNode = EntityDefinition.generateBaseTerm(node.category, node);

        activity.addNode(activityNode);
    });

    each(activityDescription.triples, (triple) => {
        const objectNode = activity.getNode(triple.object);

        if (objectNode) {
            const predicate: Predicate = objectNode.predicate;

            predicate.edge = Entity.createEntity(triple.predicate);
            objectNode.treeLevel++;
            activity.addEdgeById(triple.subject, triple.object, predicate);
        }
    });

    //activity.postRunUpdate();
    activity.updateEntityInsertMenu();
    activity.enableSubmit();
    return activity;
};

export const createActivityShex = (activityDescription: ActivityDescription): Activity => {
    const self = this;
    const activity = new Activity();

    activity.activityType = activityDescription.type;

    each(activityDescription.nodes, (node: ActivityNodeDisplay) => {
        const activityNode = EntityDefinition.generateBaseTerm(node.category, node);

        activity.addNode(activityNode);
    });

    each(activityDescription.triples, (triple) => {
        const objectNode = activity.getNode(triple.object);

        if (objectNode) {
            const predicate: Predicate = objectNode.predicate;

            predicate.edge = Entity.createEntity(triple.predicate);
            objectNode.treeLevel++;
            activity.addEdgeById(triple.subject, triple.object, predicate);
        }
    });

    //activity.postRunUpdate();
    activity.updateShapeMenuShex();
    activity.enableSubmit();
    return activity;
};

export const insertNode = (activity: Activity, subjectNode: ActivityNode, nodeDescription: InsertNodeDescription): ActivityNode => {
    const objectNode = EntityDefinition.generateBaseTerm(nodeDescription.node.category, nodeDescription.node);

    objectNode.id = activity.exist(nodeDescription.node.type) ?
        `${nodeDescription.node.type}'@@'${uuid()}` :
        nodeDescription.node.type;

    objectNode.subjectId = subjectNode.id

    objectNode.type = nodeDescription.node.type;
    activity.addNode(objectNode);
    objectNode.treeLevel = subjectNode.treeLevel + 1;

    const predicate: Predicate = activity.getNode(objectNode.id).predicate;
    predicate.subjectId = subjectNode.id;
    predicate.objectId = objectNode.id;
    predicate.edge = Entity.createEntity(nodeDescription.predicate);

    activity.updateEdges(subjectNode, objectNode, predicate);
    activity.resetPresentation();
    return objectNode;
};

export const insertNodeShex = (activity: Activity,
    subjectNode: ActivityNode,
    predExpr: ShapeDescription.PredicateExpression): ActivityNode => {
    const lookupTable = DataUtils.genTermLookupTable();
    const shapes = shexJson.goshapes as ShexShapeAssociation[];

    const ranges = []
    subjectNode.category.forEach((category: GoCategory) => {
        //const subjectShapes = DataUtils.getSubjectShapes(shapes, category.category);
        console.log(category.category)
        const shape = DataUtils.getRangeBySubject(shapes, category.category, predExpr.id);
        if (shape) {
            const range = shape.object.map(inNode => {
                const node = lookupTable[inNode]
                const category = new GoCategory()
                category.category = node.id

                return category;
            })
            ranges.push(...range)
        }
    })

    const overrides = getNodeDefaults(subjectNode, predExpr, ranges)
    const objectNode = EntityDefinition.generateBaseTerm(ranges, overrides);

    objectNode.id = uuid()
    objectNode.subjectId = subjectNode.id

    // objectNode.type = nodeDescription.node.type;
    activity.addNode(objectNode);
    objectNode.treeLevel = subjectNode.treeLevel + 1;

    const predicate: Predicate = activity.getNode(objectNode.id).predicate;
    predicate.subjectId = subjectNode.id;
    predicate.objectId = objectNode.id;
    predicate.edge = Entity.createEntity(predExpr);

    activity.updateEdges(subjectNode, objectNode, predicate);
    activity.resetPresentation();
    return objectNode;
};
