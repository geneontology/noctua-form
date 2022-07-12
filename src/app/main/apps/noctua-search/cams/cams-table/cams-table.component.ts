import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { noctuaAnimations } from '@noctua/animations';
import { NoctuaSearchService } from '@noctua.search/services/noctua-search.service';

import {
  NoctuaFormConfigService,
  NoctuaUserService,
  CamService,
  Cam,
  ActivityDisplayType,
} from '@geneontology/noctua-form-base';

import { MatPaginatorIntl } from '@angular/material/paginator';
import { CamPage } from '@noctua.search/models/cam-page';
import { NoctuaSearchMenuService } from '@noctua.search/services/search-menu.service';
import { SelectionModel } from '@angular/cdk/collections';
import { NoctuaCommonMenuService } from '@noctua.common/services/noctua-common-menu.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ReviewMode } from '@noctua.search/models/review-mode';
import { NoctuaReviewSearchService } from '@noctua.search/services/noctua-review-search.service';
import { NoctuaUtils } from '@noctua/utils/noctua-utils';
import { LeftPanel, MiddlePanel, RightPanel } from '@noctua.search/models/menu-panels';
import { each, find } from 'lodash';
import { TableOptions } from '@noctua.common/models/table-options';
import { SearchFilterType } from '@noctua.search/models/search-criteria';


export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'GO CAMs per page:';

  return customPaginatorIntl;
}

@Component({
  selector: 'noc-cams-table',
  templateUrl: './cams-table.component.html',
  styleUrls: ['./cams-table.component.scss'],
  animations: [
    noctuaAnimations,
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }
  ]
})
export class CamsTableComponent implements OnInit, OnDestroy {
  SearchFilterType = SearchFilterType
  ReviewMode = ReviewMode;
  LeftPanel = LeftPanel;
  MiddlePanel = MiddlePanel;
  RightPanel = RightPanel;

  loadingSpinner: any = {
    color: 'primary',
    mode: 'indeterminate'
  };

  private _unsubscribeAll: Subject<any>;
  private _isReviewMode: string;

  @Input() set isReviewMode(value: any) {
    this._isReviewMode = value;
    this.initTable(this._isReviewMode);
  }

  get isReviewMode(): any {
    return this._isReviewMode;
  }

  displayedColumns = [];

  searchCriteria: any = {};
  searchFormData: any = [];
  searchForm: FormGroup;

  cams: any[] = [];
  camPage: CamPage;

  tableOptions: TableOptions = {
    displayType: ActivityDisplayType.TREE,
    slimViewer: false,
  }

  selection = new SelectionModel<Cam>(true, []);

  constructor(
    private camService: CamService,

    public noctuaReviewSearchService: NoctuaReviewSearchService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaCommonMenuService: NoctuaCommonMenuService,
    public noctuaSearchMenuService: NoctuaSearchMenuService,
    public noctuaUserService: NoctuaUserService,
    public noctuaSearchService: NoctuaSearchService) {
    this._unsubscribeAll = new Subject();

    this.selection.sort();
  }

  initTable(isReviewMode) {
    this.displayedColumns = [
      'expand',
      'title',
      'saved',
      'state',
      'date',
      'contributor',
      'edit',
    ];

    if (isReviewMode) {
      this.displayedColumns.unshift('select');
    }
  }

  ngOnInit(): void {

    this.noctuaSearchService.onCamsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(cams => {
        if (!cams) {
          return;
        }
        this.cams = cams;
        this.preCheck();
      });

    this.camService.onCamsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(cams => {
        if (!cams) {
          return;
        }
        this.preCheck();
      });

    this.noctuaSearchService.onCamsPageChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((camPage: CamPage) => {
        if (!camPage) {
          return;
        }
        this.camPage = camPage;
      });

    this.noctuaReviewSearchService.onResetReview
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((remove: boolean) => {
        if (remove) {
          this.camService.clearCams();
          this.selection.clear();
        }
      });

    this.noctuaReviewSearchService.onReplaceChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((refresh: boolean) => {
        if (refresh) {
          this.refresh();
        }
      });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.cams.length;

    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.cams.forEach(row => this.selection.select(row));
  }

  toggleSelection(cam: Cam) {
    this.selection.toggle(cam);
    if (this.selection.isSelected(cam)) {
      this.addToReview(cam);
    } else {
      this.noctuaReviewSearchService.removeCamFromReview(cam);
    }
  }

  preCheck() {
    const self = this;
    this.selection.clear();

    each(self.cams, (cam) => {
      const found = find(self.camService.cams, { id: cam.id });

      if (found) {
        self.selection.select(cam);
      }
    });


  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  toggleLeftDrawer(panel) {
    this.noctuaSearchMenuService.toggleLeftDrawer(panel);
  }

  search() {
    const searchCriteria = this.searchForm.value;
    this.noctuaSearchService.search(searchCriteria);
  }

  getStateClass(stateLabel) {
    return {
      'noc-development': stateLabel === 'development',
      'noc-production': stateLabel === 'production',
      'noc-review': stateLabel === 'review'
    };
  }

  setPage($event) {
    if (this.camPage) {
      let pageIndex = $event.pageIndex;
      if (this.noctuaSearchService.searchCriteria.camPage.size > $event.pageSize) {
        pageIndex = 0;
      }
      this.noctuaSearchService.getPage(pageIndex, $event.pageSize);
    }
  }

  isExpansionDetailRow(i: number, cam: Cam) {
    return cam.expanded;
  }

  toggleCamExpand(cam: Cam) {
    if (!cam.expanded) {
      this.openCam(cam);
    } else {
      cam.expanded = false;
    }
    //  this._changeDetectorRef.markForCheck();

  }

  addToReview(cam: Cam) {
    this.noctuaReviewSearchService.addCamsToReview([cam], this.camService.cams);
    this.noctuaReviewSearchService.addToArtBasket(cam.id, cam.title);
  }

  openCam(cam: Cam) {
    //cam.rebuildRule.autoMerge = true;
    //cam.rebuildRule.autoRebuild = true;
    this.camService.loadCam(cam);
    cam.expanded = true;
    this.camService.cam = cam;
    this.camService.onCamChanged.next(cam);
  }

  openCamForm(cam: Cam) {
    this.camService.cam = cam;
    this.camService.initializeForm(cam);
    this.camService.onCamChanged.next(cam);

    this.openRightDrawer(RightPanel.camForm)
  }

  openCopyModel(cam: Cam) {
    this.camService.loadCamMeta(cam)
    this.camService.cam = cam;

    this.camService.onCamChanged.next(cam);

    this.openRightDrawer(RightPanel.copyModel)
  }

  openLeftDrawer(panel: LeftPanel) {
    this.noctuaSearchMenuService.selectLeftPanel(panel);
    this.noctuaSearchMenuService.openLeftDrawer();
  }

  openRightDrawer(panel: RightPanel) {
    this.noctuaSearchMenuService.selectRightPanel(panel);
    this.noctuaSearchMenuService.openRightDrawer();
  }

  refresh() {
    this.noctuaSearchService.updateSearch();
  }

  reset() {
    this.noctuaSearchService.clearSearchCriteria();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  cleanId(dirtyId: string) {
    return NoctuaUtils.cleanID(dirtyId);
  }

}

