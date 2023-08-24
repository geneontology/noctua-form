import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { getColor } from '@noctua.common/data/noc-colors';
import { TermsSummary, CamStatsService, BbopGraphService } from '@geneontology/noctua-form-base';
import { Subject } from 'rxjs';

@Component({
  selector: 'noc-aspect-stats',
  templateUrl: './aspect-stats.component.html',
  styleUrls: ['./aspect-stats.component.scss']
})
export class AspectStatsComponent implements OnInit, OnDestroy {
  @Input()
  termsSummary: TermsSummary;

  @Input()
  aspect: string;



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


  stats = {
    mfPie: [],
    bpPie: [],
    ccPie: [],
  }



  private _unsubscribeAll: Subject<any>;
  pies: { label: string; data: any[]; }[];

  constructor(
    private _camStatsService: CamStatsService,
    private _bbopGraphService: BbopGraphService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    this.stats.mfPie = this._camStatsService.buildTermsPie(this.termsSummary.mf.nodes)
    this.stats.bpPie = this._camStatsService.buildTermsPie(this.termsSummary.bp.nodes)
    this.stats.ccPie = this._camStatsService.buildTermsPie(this.termsSummary.cc.nodes)

    this.pies = [
      {
        label: 'Molecular Function',
        data: this.stats.mfPie
      }, {
        label: 'Biological Process',
        data: this.stats.bpPie
      }, {
        label: 'Cellular Component',
        data: this.stats.ccPie
      }]
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
