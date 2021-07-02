import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { Cam, CamLoadingIndicator, CamService, CamsService, NoctuaFormConfigService, NoctuaUserService } from 'noctua-form-base';
import { NoctuaSearchService } from './../..//services/noctua-search.service';
import { NoctuaSearchMenuService } from '../../services/search-menu.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { ArtBasket, ArtBasketItem } from './../..//models/art-basket';
import { NoctuaReviewSearchService } from './../../services/noctua-review-search.service';
import { NoctuaConfirmDialogService } from '@noctua/components/confirm-dialog/confirm-dialog.service';
import { LeftPanel, MiddlePanel } from './../../models/menu-panels';
import { NoctuaSearchDialogService } from './../../services/dialog.service';
import { ReloadType } from './../../models/review-mode';

@Component({
  selector: 'noc-art-basket',
  templateUrl: './art-basket.component.html',
  styleUrls: ['./art-basket.component.scss']
})
export class ArtBasketComponent implements OnInit, OnDestroy {
  MiddlePanel = MiddlePanel;
  artBasket: ArtBasket = new ArtBasket();
  cams: Cam[] = [];
  summary;

  loadingSpinner: any = {
    color: 'primary',
    mode: 'indeterminate'
  };

  private _unsubscribeAll: Subject<any>;

  constructor(
    private zone: NgZone,
    public camsService: CamsService,
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
    this.noctuaReviewSearchService.onArtBasketChanged.pipe(
      takeUntil(this._unsubscribeAll))
      .subscribe((artBasket: ArtBasket) => {
        if (artBasket) {
          this.artBasket = artBasket;
        }
      });

    this.camsService.onCamsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(cams => {
        if (!cams) {
          return;
        }
        this.cams = cams;
      });

    this.camsService.onCamsCheckoutChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(summary => {
        if (!summary) {
          return;
        }

        this.summary = summary;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  backToReview() {
    this.noctuaSearchMenuService.selectMiddlePanel(MiddlePanel.camsReview);
  }

  clear() {
    const self = this;
    const success = (clear) => {
      if (clear) {

        this.noctuaReviewSearchService.onClearForm.next(true);
        this.noctuaReviewSearchService.clear();
        this.camsService.clearCams();
        this.noctuaReviewSearchService.clearBasket();
      }
    };

    if (self.summary?.stats.totalChanges > 0) {
      const options = {
        title: 'Confirm Clear Basket?',
        message: 'You are about to remove all items from the basket. Please save changes or undo changes.',
        cancelLabel: 'Go Back',
        confirmLabel: 'Clear Anyway'
      };

      self.noctuaSearchDialogService.openCamReviewChangesDialog(success, self.summary, options)
    } else {
      const options = {
        cancelLabel: 'No',
        confirmLabel: 'Yes'
      };

      this.confirmDialogService.openConfirmDialog('Confirm Clear Basket?',
        'You are about to remove all items from the basket.',
        success, options);
    }
  }

  close() {
    this.noctuaSearchMenuService.closeLeftDrawer();
  }


  remove(cam: Cam) {
    const self = this;
    const summary = self.camsService.reviewCamChanges(cam)
    const success = (ok) => {
      if (ok) {
        this.noctuaReviewSearchService.removeCamFromReview(cam);
      }
    }

    if (summary?.stats.totalChanges > 0) {
      const options = {
        title: 'Removing Unsaved Model',
        message: `Please save changes or undo changes before removing model. Model Name:"${cam.title}"`,
        cancelLabel: 'Cancel',
        confirmLabel: 'Remove Anyway'
      }

      self.noctuaSearchDialogService.openCamReviewChangesDialog(success, summary, options)
    } else {
      const options = {
        cancelLabel: 'No',
        confirmLabel: 'Yes'
      };

      this.confirmDialogService.openConfirmDialog('Removing Unsaved Model?',
        `You are about to remove model from the basket. No changes were made. Model Name:"${cam.title}"`,
        success, options);
    }
  }

  resetCam(cam: Cam) {
    const self = this;

    const summary = self.camsService.reviewCamChanges(cam);
    const success = (ok) => {
      if (ok) {
        self._resetCamsQuery([cam]);
      }
    }

    if (summary?.stats.totalChanges > 0) {

      const options = {
        title: 'Discard Unsaved Changes',
        message: `All your changes will be discarded for model. Model Name:"${cam.title}"`,
        cancelLabel: 'Cancel',
        confirmLabel: 'OK'
      }

      self.noctuaSearchDialogService.openCamReviewChangesDialog(success, summary, options)
    } else {
      success(true);
    }
  }

  resetCams() {
    const self = this;

    const success = (ok) => {
      if (ok) {
        self._resetCamsQuery(self.camsService.cams);
      }
    }
    if (self.summary?.stats.totalChanges > 0) {

      const options = {
        title: 'Discard Unsaved Changes',
        message: `All your changes will be discarded.`,
        cancelLabel: 'Cancel',
        confirmLabel: 'OK'
      }

      self.noctuaSearchDialogService.openCamReviewChangesDialog(success, self.summary, options)
    } else {
      success(true);
    }
  }

  reviewChanges() {
    const self = this;

    self.camsService.reviewChanges();
    self.noctuaSearchMenuService.selectMiddlePanel(MiddlePanel.reviewChanges);
  }

  reviewCamChanges(cam: Cam) {
    const self = this;

    const success = (done) => {
    }

    const summary = self.camsService.reviewCamChanges(cam)
    self.noctuaSearchDialogService.openCamReviewChangesDialog(success, summary)

  }

  selectItem(artBasketItem: ArtBasketItem) {
    this.camsService.onSelectedCamChanged.next(artBasketItem.id);
    const q = '#noc-review-cams-' + artBasketItem.displayId;
    this.noctuaSearchMenuService.scrollTo(q);
  }

  submitChanges() {
    const self = this;

    const success = (replace) => {
      if (replace) {
        self.noctuaSearchMenuService.scrollToTop();

        self._storeCamsQuery(self.camsService.cams, true);
        this.noctuaSearchMenuService.selectMiddlePanel(MiddlePanel.camsReview);
      };
    }

    if (self.summary?.stats.totalChanges > 0) {
      const options = {
        title: 'Save Changes?',
        message: `Bulk edit all changes`,
        cancelLabel: 'Go Back',
        confirmLabel: 'Submit'
      }

      self.noctuaSearchDialogService.openCamReviewChangesDialog(success, self.summary, options)
    }
  }

  submitChange(cam: Cam) {

    const self = this;
    const summary = self.camsService.reviewCamChanges(cam);

    if (summary?.stats.totalChanges > 0) {
      const success = (replace) => {
        if (replace) {
          self._storeCamsQuery([cam]);
        }
      };

      const options = {
        title: 'Save Changes?',
        message: `All your changes will be saved for model. Model Name:"${cam.title}"`,
        cancelLabel: 'Go Back',
        confirmLabel: 'Submit'
      }

      self.noctuaSearchDialogService.openCamReviewChangesDialog(success, summary, options)
    }
  }


  private _storeCamsQuery(cams: Cam[], reset = false) {
    const self = this;

    self.noctuaReviewSearchService.reloadCams(cams, self.camsService.cams, ReloadType.STORE, reset)
  }

  private _resetCamsQuery(cams: Cam[], reset = false) {
    const self = this;

    self.noctuaReviewSearchService.reloadCams(cams, self.camsService.cams, ReloadType.RESET, reset)
  }
}
