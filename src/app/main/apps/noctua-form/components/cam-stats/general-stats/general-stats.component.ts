import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { getColor } from '@noctua.common/data/noc-colors';
import { ActivityNode, ActivityNodeType, Cam, CamStatsService, BbopGraphService, NoctuaLookupService, TermsSummary } from '@geneontology/noctua-form-base';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'noc-general-stats',
  templateUrl: './general-stats.component.html',
  styleUrls: ['./general-stats.component.scss']
})
export class GeneralStatsComponent implements OnInit, OnDestroy {
  @Input()
  termsSummary: TermsSummary;

  aspectOptions = {
    view: [500, 200],
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
    view: [500, 200],
    gradient: true,
    legend: false,
    showLabels: true,
    isDoughnut: false,
    maxLabelLength: 20,
    colorScheme: {
      domain: [getColor('green', 500), getColor('brown', 500), getColor('purple', 500)]
    },

  }

  termsBarOptions = {
    view: [500, 400],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    legend: false,
    showXAxisLabel: true,
    maxYAxisTickLength: 30,
    yAxisLabel: 'Terms',
    showYAxisLabel: true,
    xAxisLabel: 'Count',
  }

  stats = {
    aspect: [],
    aspectPie: [],
    termsBar: [],
  }

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _camStatsService: CamStatsService,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    this.stats.aspect = this._camStatsService.buildTermsStats(this.termsSummary)
    this.stats.aspectPie = this._camStatsService.buildAspectPie([this.termsSummary.mf, this.termsSummary.bp, this.termsSummary.cc])
    this.stats.termsBar = this._camStatsService.buildTermsDistribution([
      this.termsSummary.mf,
      this.termsSummary.bp,
      this.termsSummary.cc,
      this.termsSummary.other]
    )

    //this.getCustomColors(this.stats.termsBar)
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  getCustomColors(nodes) {
    const customColors = nodes.map((node: ActivityNode) => {
      let color = "#AAAAAA"
      if (node.type = ActivityNodeType.GoMolecularEntity) {
        color = getColor('blue', 500)
      } else if (node.type = ActivityNodeType.GoMolecularFunction) {
        color = getColor('brown', 500)
      } else if (node.type = ActivityNodeType.GoBiologicalProcess) {
        color = getColor('purple', 500)
      } else if (node.type = ActivityNodeType.GoCellularComponent) {
        color = getColor('green', 500)
      }
      return { name: node.term.label, value: color }
    });

    return customColors;
  }

}
