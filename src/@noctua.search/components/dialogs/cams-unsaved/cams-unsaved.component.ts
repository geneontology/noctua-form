
import { Component, OnDestroy, OnInit, Inject, NgZone, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';

import {
  Cam,
  NoctuaUserService,
  NoctuaFormConfigService,
  CamsService,
  CamService
} from 'noctua-form-base';

import { takeUntil } from 'rxjs/operators';
import { NoctuaSearchService } from '../../../services/noctua-search.service';
import { noctuaAnimations } from '@noctua/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoctuaReviewSearchService } from '../../../services/noctua-review-search.service';
import { NoctuaSearchDialogService } from '../../../services/dialog.service';
import { NoctuaSearchMenuService } from '../../../services/search-menu.service';
import { NoctuaConfirmDialogService } from '@noctua/components/confirm-dialog/confirm-dialog.service';
import { LeftPanel, MiddlePanel } from '../../../models/menu-panels';
import { ReviewMode } from '../../../models/review-mode';

@Component({
  selector: 'noc-cams-unsaved-dialog',
  templateUrl: './cams-unsaved.component.html',
  styleUrls: ['./cams-unsaved.component.scss'],
  animations: noctuaAnimations,
})
export class CamsUnsavedDialogComponent implements OnInit, OnDestroy, AfterViewInit {
  cams: Cam[] = []
  summary;

  private _unsubscribeAll: Subject<any>;

  constructor
    (
      private _matDialogRef: MatDialogRef<CamsUnsavedDialogComponent>,
      private camsService: CamsService,
      private zone: NgZone,
      public camService: CamService,
      public noctuaConfigService: NoctuaFormConfigService,
      private confirmDialogService: NoctuaConfirmDialogService,
      public noctuaSearchDialogService: NoctuaSearchDialogService,
      public noctuaUserService: NoctuaUserService,
      public noctuaSearchMenuService: NoctuaSearchMenuService,
      public noctuaSearchService: NoctuaSearchService,
      public noctuaFormConfigService: NoctuaFormConfigService,
      private noctuaReviewSearchService: NoctuaReviewSearchService,) {
    this._unsubscribeAll = new Subject();

  }

  ngOnInit(): void {

    this.camsService.onCamsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(cams => {
        if (!cams) {
          return;
        }
        this.cams = cams;
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.camsService.onCamsCheckoutChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(summary => {
          if (!summary) {
            return;
          }

          this.summary = summary;
        });
    }, 1);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  reviewChanges() {
    const self = this;

    self.camsService.reviewChanges();
    self.noctuaSearchMenuService.selectLeftPanel(LeftPanel.artBasket);
    self.noctuaSearchMenuService.selectMiddlePanel(MiddlePanel.camsReview);
    self.noctuaSearchMenuService.reviewMode = ReviewMode.on;
    self.noctuaSearchMenuService.isReviewMode = true;
    this.close();
  }

  logout() {
    this.noctuaReviewSearchService.clear();
    this.camsService.clearCams();
    this.noctuaReviewSearchService.clearBasket();

    this._matDialogRef.close(true);
  }

  close() {
    this._matDialogRef.close();
  }
}


