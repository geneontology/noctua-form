import { Component, OnInit, OnDestroy, NgZone, Input, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivityNode, Article, Cam, CamLoadingIndicator, CamService, CamStats, CamSummary, EntityType, Evidence, LeftPanel, NoctuaFormConfigService, NoctuaFormMenuService, NoctuaGraphService, NoctuaLookupService, NoctuaUserService, RightPanel, TermsSummary } from '@geneontology/noctua-form-base';
import { NoctuaSearchService } from './../..//services/noctua-search.service';
import { NoctuaSearchMenuService } from '../../services/search-menu.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { NoctuaReviewSearchService } from './../../services/noctua-review-search.service';
import { NoctuaConfirmDialogService } from '@noctua/components/confirm-dialog/confirm-dialog.service';
import { MiddlePanel } from './../../models/menu-panels';
import { NoctuaSearchDialogService } from './../../services/dialog.service';
import { MatDrawer } from '@angular/material/sidenav';
import { SearchCriteria } from '@noctua.search/models/search-criteria';
import { environment } from 'environments/environment';

@Component({
  selector: 'noc-cam-terms',
  templateUrl: './cam-terms.component.html',
  styleUrls: ['./cam-terms.component.scss']
})
export class CamTermsComponent implements OnInit, OnDestroy {
  MiddlePanel = MiddlePanel;
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

  treeOptions = {
    allowDrag: false,
    allowDrop: false,
    // levelPadding: 15,
  };

  private _unsubscribeAll: Subject<any>;
  treeNodes

  constructor(
    private zone: NgZone,
    private noctuaLookupService: NoctuaLookupService,
    private _noctuaGraphService: NoctuaGraphService,
    public noctuaFormMenuService: NoctuaFormMenuService,
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
    this._noctuaGraphService.onCamGraphChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cam: Cam) => {
        if (!cam) {
          return;
        }
        this.cam = cam;
        this.termsSummary = this._noctuaGraphService.getTerms(this.cam.graph)
        this.treeNodes = this.camService.buildTermsTree(this.termsSummary)
        const pmids = this.termsSummary.papers.nodes.map((article: Article) => {
          return Evidence.getReferenceNumber(article.id)
        })

        this.noctuaLookupService.addPubmedInfos(pmids)
      });

    this.noctuaLookupService.onArticleCacheReady
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((ready: boolean) => {
        if (!ready) {
          return;
        }

        this.termsSummary.papers.nodes.forEach((article: Article) => {
          const cachedArticle = this.noctuaLookupService.articleCache[article.id]
          if (cachedArticle) {
            article.title = cachedArticle.title
            article.link = cachedArticle.link
            article.author = cachedArticle.author
            article.date = cachedArticle.date
          }
        })
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
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
    const url = `${environment.noctuaLandingPageUrl}?${searchCriteria.build()}`
    window.open(url, '_blank');
  }

  searchModelsByContributor(node: ActivityNode) {
    const searchCriteria = new SearchCriteria()
    searchCriteria.terms = [node.term]
    searchCriteria.contributors = [this.noctuaUserService.user]
    const url = `${environment.noctuaLandingPageUrl}?${searchCriteria.build()}`
    window.open(url, '_blank')
  }

  openTermDetail(term) {
    this.noctuaSearchService.onDetailTermChanged.next(term)
    this.noctuaFormMenuService.openRightDrawer(RightPanel.termDetail);
  }


  onTreeLoad() {
    // this.tree.treeModel.expandAll();
  }

  close() {
    this.panelDrawer.close();
  }

}
