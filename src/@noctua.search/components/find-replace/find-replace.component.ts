import { Component, OnInit, OnDestroy, NgZone, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { Cam, CamLoadingIndicator, CamService, CamStats, NoctuaFormConfigService, NoctuaUserService } from '@geneontology/noctua-form-base';
import { NoctuaSearchService } from './../..//services/noctua-search.service';
import { NoctuaSearchMenuService } from '../../services/search-menu.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { NoctuaReviewSearchService } from './../../services/noctua-review-search.service';
import { NoctuaConfirmDialogService } from '@noctua/components/confirm-dialog/confirm-dialog.service';
import { LeftPanel, MiddlePanel } from './../../models/menu-panels';
import { NoctuaSearchDialogService } from './../../services/dialog.service';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'noc-find-replace',
  templateUrl: './find-replace.component.html',
  styleUrls: ['./find-replace.component.scss']
})
export class FindReplaceComponent implements OnInit, OnDestroy {
  MiddlePanel = MiddlePanel;

  @Input('panelDrawer')
  panelDrawer: MatDrawer;
  cam: Cam;
  summary;
  stats

  loadingSpinner: any = {
    color: 'primary',
    mode: 'indeterminate'
  };

  displayedColumns = [
    'category',
    'count'
  ];

  private _unsubscribeAll: Subject<any>;

  constructor(
    private zone: NgZone,

    public camService: CamService,
    private confirmDialogService: NoctuaConfirmDialogService,
    public noctuaSearchDialogService: NoctuaSearchDialogService,
    public noctuaUserService: NoctuaUserService,
    public noctuaReviewSearchService: NoctuaReviewSearchService,
    public noctuaSearchMenuService: NoctuaSearchMenuService,
    public noctuaSearchService: NoctuaSearchService,
    public noctuaFormConfigService: NoctuaFormConfigService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.camService.onCamChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cam: Cam) => {
        if (!cam) {
          return;
        }
        this.cam = cam;
      });

    this.camService.onCamsCheckoutChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(summary => {
        if (!summary) {
          return;
        }

        this.summary = summary
        this.stats = this.generateStats(this.summary.stats);
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  backToReview() {
    this.noctuaSearchMenuService.selectMiddlePanel(MiddlePanel.camsReview);
  }

  close() {
    this.panelDrawer.close();
  }

  reviewCamChanges(cam: Cam) {
    const self = this;

    const success = (done) => {
    }

    const summary = self.camService.reviewCamChanges(cam)
    self.noctuaSearchDialogService.openCamReviewChangesDialog(success, summary)

  }

  generateStats(stats: CamStats): any[] {
    stats.updateTotal();
    const result = [{
      category: 'Genes',
      count: stats.gpsCount
    }, {
      category: 'Terms',
      count: stats.termsCount
    }, {
      category: 'Evidence',
      count: stats.evidenceCount
    }, {
      category: 'Reference',
      count: stats.referencesCount
    }, {
      category: 'With',
      count: stats.withsCount
    }, {
      category: 'Relations',
      count: stats.relationsCount
    }];

    return result;
  }

}
