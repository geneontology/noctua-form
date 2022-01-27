import { noctuaFormConfig } from '@geneontology/noctua-form-base';

export function getEdgeColor(edgeId) {
    switch (edgeId) {
        case noctuaFormConfig.edge.directlyRegulates.id:
        case noctuaFormConfig.edge.causallyUpstreamOfOrWithin.id:
        case noctuaFormConfig.edge.causallyUpstreamOf.id:
            return 'grey'
        case noctuaFormConfig.edge.positivelyRegulates.id:
        case noctuaFormConfig.edge.directlyPositivelyRegulates.id:
        case noctuaFormConfig.edge.causallyUpstreamOfPositiveEffect.id:
        case noctuaFormConfig.edge.isSmallMoleculeActivator.id:
            return 'green'
        case noctuaFormConfig.edge.negativelyRegulates.id:
        case noctuaFormConfig.edge.directlyNegativelyRegulates.id:
        case noctuaFormConfig.edge.causallyUpstreamOfNegativeEffect.id:
        case noctuaFormConfig.edge.isSmallMoleculeInhibitor.id:
            return 'red'
        default:
            return 'black'
    }

}


