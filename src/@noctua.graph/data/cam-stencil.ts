import { ActivityType, noctuaFormConfig } from "noctua-form-base";
import { cloneDeep } from "lodash";

export interface StencilItemNode {
    id: string;
    label: string;
    type: ActivityType,
    iconUrl: string
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
        iconUrl: './assets/images/activity/default.png'
    }, {
        type: ActivityType.bpOnly,
        id: noctuaFormConfig.activityType.options.bpOnly.name,
        label: noctuaFormConfig.activityType.options.bpOnly.label.toUpperCase(),
        iconUrl: './assets/images/activity/bpOnly.png'
    }, {
        type: ActivityType.ccOnly,
        id: noctuaFormConfig.activityType.options.ccOnly.name,
        label: noctuaFormConfig.activityType.options.ccOnly.label.toUpperCase(),
        iconUrl: './assets/images/activity/ccOnly.png'
    }, {
        type: ActivityType.molecule,
        id: noctuaFormConfig.activityType.options.molecule.name,
        label: noctuaFormConfig.activityType.options.molecule.label.toUpperCase(),
        iconUrl: './assets/images/activity/molecule.png'
    }]
}]

export const noctuaStencil = {
    camStencil: cloneDeep(camStencil)
};

