import { Component, OnInit, OnDestroy, NgZone, Input, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivityNode, Cam, CamService, CamSummary, Contributor, Entity, EntityType, LeftPanel, NoctuaFormConfigService, NoctuaFormMenuService, NoctuaGraphService, NoctuaLookupService, NoctuaUserService, RightPanel, TermsSummary } from 'noctua-form-base';
import { takeUntil } from 'rxjs/operators';
import { MatDrawer } from '@angular/material/sidenav';
import { SearchCriteria } from '@noctua.search/models/search-criteria';
import { environment } from 'environments/environment';
import { NoctuaReviewSearchService } from '@noctua.search/services/noctua-review-search.service';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';
import { getColor } from '@noctua.common/data/noc-colors';
import { orderBy } from 'lodash';

@Component({
  selector: 'noc-cam-stats',
  templateUrl: './cam-stats.component.html',
  styleUrls: ['./cam-stats.component.scss']
})
export class CamStatsComponent implements OnInit, OnDestroy {
  EntityType = EntityType;

  @ViewChild('tree') tree;
  @Input('panelDrawer')
  panelDrawer: MatDrawer;
  cam: Cam;
  termsSummary: TermsSummary;

  loadingSpinner: any = {
    color: 'primary',
    mode: 'indeterminate'
  };



  // options

  aspectOptions = {
    view: [400, 200],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    legend: false,
    showXAxisLabel: true,
    xAxisLabel: 'Aspect',
    showYAxisLabel: true,
    yAxisLabel: 'Annotations',
    animations: true,
    legendPosition: 'below',
    colorScheme: {
      domain: ['#AAAAAA']
    },
    customColors: []
  }

  aspectPieOptions = {
    view: [400, 200],
    gradient: true,
    legend: false,
    showLabels: true,
    isDoughnut: false,
    maxLabelLength: 20,
    colorScheme: {
      domain: [getColor('green', 500), getColor('brown', 500), getColor('purple', 500)]
    },

  }

  gpPieOptions = {
    view: [400, 200],
    gradient: true,
    legend: false,
    showLabels: true,
    isDoughnut: false,
    maxLabelLength: 20,
    colorScheme: {
      domain: ['#5AA454', '#C7B42C', '#AAAAAA']
    }
  }

  relationsBarOptions = {
    view: [400, 400],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    legend: false,
    showXAxisLabel: true,
    maxYAxisTickLength: 20,
    yAxisLabel: 'Relation',
    showYAxisLabel: true,
    xAxisLabel: 'Count',
  }

  contributorBarOptions = {
    view: [400, 300],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    legend: false,
    showXAxisLabel: true,
    maxYAxisTickLength: 25,
    yAxisLabel: 'Contributor',
    showYAxisLabel: true,
    xAxisLabel: 'Number of Statements',
  }

  datesLineOptions = {
    view: [400, 400],
    legend: false,
    legendPosition: 'below',
    showLabels: true,
    animations: true,
    xAxis: true,
    yAxis: true,
    showYAxisLabel: true,
    showXAxisLabel: true,
    xAxisLabel: 'Curated Statements',
    yAxisLabel: 'Statements',
    timeline: true,
  }

  private _unsubscribeAll: Subject<any>;
  stats = {
    aspect: [],
    aspectPie: [],
    gpPie: [],
    mfPie: [],
    bpPie: [],
    ccPie: [],
    contributorBar: [],
    relationsBar: [],
    datesLine: []
  }

  pies = []

  constructor(
    private zone: NgZone,
    private noctuaLookupService: NoctuaLookupService,
    private _noctuaGraphService: NoctuaGraphService,
    public noctuaFormMenuService: NoctuaFormMenuService,
    public camService: CamService,
    public noctuaUserService: NoctuaUserService,
    public noctuaReviewSearchService: NoctuaReviewSearchService,
    public noctuaSearchService: NoctuaSearchService,
    public noctuaFormConfigService: NoctuaFormConfigService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._noctuaGraphService.onCamGraphChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cam: Cam) => {
        if (!cam) {
          return;
        }
        this.cam = cam;
        this.termsSummary = this._noctuaGraphService.getTerms(this.cam.graph)
        this.stats.aspect = this.buildTermsStats(this.termsSummary)
        this.stats.aspectPie = this.buildAspectPie([this.termsSummary.mf, this.termsSummary.bp, this.termsSummary.cc])
        this.stats.gpPie = this.buildTermsPie(this.termsSummary.gp.nodes)
        this.stats.mfPie = this.buildTermsPie(this.termsSummary.mf.nodes)
        this.stats.bpPie = this.buildTermsPie(this.termsSummary.bp.nodes)
        this.stats.ccPie = this.buildTermsPie(this.termsSummary.cc.nodes)
        this.stats.relationsBar = this.buildRelationsPie(this.termsSummary.relations.nodes)
        this.stats.datesLine = this.buildContributionsStats(this.termsSummary.dates.nodes)
        this.stats.contributorBar = this.buildContributorBar(this.termsSummary.contributors.nodes)

        this.pies = [{
          label: 'Gene Product',
          data: this.stats.gpPie
        },
        {
          label: 'Molecular Function',
          data: this.stats.mfPie
        },
        {
          label: 'Biological Process',
          data: this.stats.bpPie
        },
        {
          label: 'Cellular Component',
          data: this.stats.ccPie
        }]
      });

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }



  buildTermsStats(termsSummary: TermsSummary) {
    const allTerms = [
      termsSummary.mf,
      termsSummary.bp,
      termsSummary.cc,
      termsSummary.gp,
      termsSummary.other,
    ]
    this.aspectOptions.customColors = []
    const stats = allTerms.map((camSummary: CamSummary<ActivityNode>) => {
      return {
        name: camSummary.shorthand ? camSummary.shorthand : camSummary.label,
        series: camSummary.getSortedNodes().map((node: ActivityNode) => {
          let color = "#AAAAAA"
          if (camSummary.shorthand === 'MF') {
            color = getColor('green', 500)
          } else if (camSummary.shorthand === 'BP') {
            color = getColor('brown', 500)
          } else if (camSummary.shorthand === 'CC') {
            color = getColor('purple', 500)
          } else if (camSummary.shorthand === 'GP') {
            color = getColor('blue', 500)
          }
          this.aspectOptions.customColors.push({ name: node.term.label, value: color })
          return {
            name: node.term.label,
            value: node.frequency
          }
        })

      }
    })

    return stats
  }

  buildContributionsStats(nodes) {
    const sorted = orderBy(nodes, ['id'])
    this.aspectOptions.customColors = []
    let cumulative = 0;

    const stats = [{
      name: 'All Contributors',
      series: sorted.map((node: Entity) => {
        cumulative += node.frequency
        return {
          name: node.label,
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

    const stats = nodes.map((node: Entity) => {
      return {
        name: node.label,
        value: node.frequency
      }
    })

    return stats
  }

  buildContributorBar(nodes: Contributor[]): any[] {
    const stats = nodes.map((node: Contributor) => {
      return {
        name: node.name,
        value: node.frequency
      }
    })

    return stats
  }


  openSearch(node) {
    this.noctuaLookupService.getTermDetail(node.term.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((term) => {
        if (!term) return;
        this.noctuaReviewSearchService.onCamTermSearch.next(term)
        this.noctuaFormMenuService.openLeftDrawer(LeftPanel.findReplace);
      })
  }

  search(node: ActivityNode) {
    this.noctuaReviewSearchService.searchCriteria['terms'] = [node.term];
    this.noctuaReviewSearchService.updateSearch();
  }

  searchModels(node: ActivityNode) {
    const searchCriteria = new SearchCriteria()
    searchCriteria.terms = [node.term]
    const url = `${environment.noctuaUrl}?${searchCriteria.build()}`
    window.open(url, '_blank');
  }

  searchModelsByContributor(node: ActivityNode) {
    const searchCriteria = new SearchCriteria()
    searchCriteria.terms = [node.term]
    searchCriteria.contributors = [this.noctuaUserService.user]
    const url = `${environment.noctuaUrl}?${searchCriteria.build()}`
    window.open(url, '_blank')
  }

  openTermDetail(term) {
    this.noctuaSearchService.onDetailTermChanged.next(term)
    this.noctuaFormMenuService.openRightDrawer(RightPanel.termDetail);
  }


  close() {
    this.panelDrawer.close();
  }

}
