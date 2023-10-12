import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { getColor } from '@noctua.common/data/noc-colors';
import { TermsSummary, CamStatsService, BbopGraphService } from '@geneontology/noctua-form-base';
import { Subject } from 'rxjs';

@Component({
  selector: 'noc-statement-stats',
  templateUrl: './statement-stats.component.html',
  styleUrls: ['./statement-stats.component.scss']
})
export class StatementStatsComponent implements OnInit, OnDestroy {
  @Input()
  termsSummary: TermsSummary;

  @Input()
  aspect: string;


  relationsBarOptions = {
    view: [500, 400],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    legend: false,
    showXAxisLabel: true,
    maxYAxisTickLength: 30,
    yAxisLabel: 'Relation',
    showYAxisLabel: true,
    xAxisLabel: 'Count',
  }


  datesLineOptions = {
    view: [500, 400],
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

  stats = {
    datesLine: [],
    relationsBar: [],
  }

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _camStatsService: CamStatsService,
    private _bbopGraphService: BbopGraphService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.stats.relationsBar = this._camStatsService.buildRelationsPie(this.termsSummary.relations.nodes)
    this.stats.datesLine = this._camStatsService.buildContributionsStats(this.termsSummary.dates.nodes)

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
