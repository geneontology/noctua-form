import { ActivityType, noctuaFormConfig } from '@geneontology/noctua-form-base';
import { cloneDeep } from "lodash";

export interface StencilItemNode {
    id: string;
    label: string;
    type: ActivityType;
    iconUrl: string;
    description: string;
}

export interface StencilItem {
    id: string;
    label: string;
    nodes: StencilItemNode[],
}


const camStencil: StencilItem[] = [{
    id: 'activity_unit',
    label: 'Activity Type',
    nodes: [{
        type: ActivityType.default,
        id: noctuaFormConfig.activityType.options.default.name,
        label: noctuaFormConfig.activityType.options.default.label.toUpperCase(),
        iconUrl: './assets/images/activity/default.png',
        description: 'Click and drag onto canvas to create new activity for a single object, either a gene product or a protein complex identifier'
    }, {
        type: ActivityType.proteinComplex,
        id: noctuaFormConfig.activityType.options.proteinComplex.name,
        label: noctuaFormConfig.activityType.options.proteinComplex.label.toUpperCase(),
        iconUrl: './assets/images/activity/proteinComplex.png',
        description: 'Click and drag onto canvas to create new activity for a protein complex that you define using a GO complex term and specifying the gene product subunits'
    }, {
        type: ActivityType.molecule,
        id: noctuaFormConfig.activityType.options.molecule.name,
        label: noctuaFormConfig.activityType.options.molecule.label.toUpperCase(),
        iconUrl: './assets/images/activity/molecule.png',
        description: 'Click and drag onto canvas to create a new small molecule that is either a substrate, a product, or a regulator of an activity'
    }]
}]

export const noctuaStencil = {
    camStencil: cloneDeep(camStencil)
};

