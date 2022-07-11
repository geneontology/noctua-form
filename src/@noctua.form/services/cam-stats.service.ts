import { Injectable } from '@angular/core';
import { NoctuaFormConfigService } from './../services/config/noctua-form-config.service';
import { ActivityNode, Entity, TermsSummary, CamSummary, ActivityNodeType } from './../models/activity';
import { orderBy } from 'lodash';
import { Contributor } from './../models/contributor';


@Injectable({
  providedIn: 'root'
})
export class CamStatsService {

  constructor(
    public noctuaFormConfigService: NoctuaFormConfigService) {
  }

  buildTermsStats(termsSummary: TermsSummary) {
    const allTerms = [
      termsSummary.mf,
      termsSummary.bp,
      termsSummary.cc,
      termsSummary.gp,
      termsSummary.other,
    ]

    const stats = allTerms.map((camSummary: CamSummary<ActivityNode>) => {
      return {
        name: camSummary.shorthand ? camSummary.shorthand : camSummary.label,
        series: camSummary.getSortedNodes().map((node: ActivityNode) => {

          return {
            name: node.term.label,
            value: node.frequency
          }
        })

      }
    })

    return stats
  }

  buildTermsDistribution(summaries: CamSummary<ActivityNode>[]) {
    const terms = summaries.reduce((acc, c) => {
      acc.push(...c.nodes)
      return acc
    }, [])

    const sorted = orderBy(terms, ['frequency'], ['desc']).slice(0, 20)
    const stats = sorted.map((node: ActivityNode) => {
      return {
        name: node.term.label,
        value: node.frequency
      }
    })

    return stats
  }

  buildContributionsStats(nodes) {
    const sorted = orderBy(nodes, ['id'])
    let cumulative = 0;

    const stats = [{
      name: 'All Contributors',
      series: sorted.map((node: Entity) => {
        cumulative += node.frequency
        return {
          name: new Date(node.label),
          value: cumulative
        }
      })

    }]

    return stats
  }

  buildAspectPie(summaryNodes) {

    const stats = summaryNodes.map((node) => {
      return {
        name: node.label,
        value: node.frequency
      }
    })

    return stats
  }

  buildTermsPie(nodes) {

    const stats = nodes.map((node: ActivityNode) => {
      return {
        name: node.term.label,
        value: node.frequency
      }
    })

    return stats
  }

  buildRelationsPie(nodes) {

    const sorted = orderBy(nodes, ['frequency'], ['desc'])

    const stats = sorted.map((node: Entity) => {
      return {
        name: node.label,
        value: node.frequency
      }
    })

    return stats
  }

  buildContributorBar(nodes: Contributor[]): any[] {
    const sorted = orderBy(nodes, ['frequency'], ['desc'])
    const stats = sorted.map((node: Contributor) => {
      return {
        name: node.name,
        value: node.frequency
      }
    })

    return stats
  }

}
