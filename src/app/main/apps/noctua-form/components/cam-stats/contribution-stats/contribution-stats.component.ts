import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { getColor } from '@noctua.common/data/noc-colors';
import { TermsSummary, CamStatsService, BbopGraphService } from '@geneontology/noctua-form-base';
import { Subject } from 'rxjs';

@Component({
  selector: 'noc-contribution-stats',
  templateUrl: './contribution-stats.component.html',
  styleUrls: ['./contribution-stats.component.scss']
})
export class ContributionStatsComponent implements OnInit, OnDestroy {
  @Input()
  termsSummary: TermsSummary;

  @Input()
  aspect: string;

  contributorBarOptions = {
    view: [500, 300],
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

  stats = {
    contributorBar: [],
  }

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _camStatsService: CamStatsService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.stats.contributorBar = this._camStatsService.buildContributorBar(this.termsSummary.contributors.nodes)
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
