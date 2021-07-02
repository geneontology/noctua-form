import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, ActivatedRoute } from '@angular/router';

import {
    Cam,
    Contributor,
    CamService,
    NoctuaUserService,
    NoctuaFormConfigService,
    NoctuaGraphService,
    NoctuaActivityFormService,
    ActivityType,
    NoctuaFormMenuService,
    LeftPanel,
} from 'noctua-form-base';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { NoctuaCommonMenuService } from '@noctua.common/services/noctua-common-menu.service';
import { NoctuaConfirmDialogService } from '@noctua/components/confirm-dialog/confirm-dialog.service';
import { ArtBasket } from '@noctua.search/models/art-basket';
import { NoctuaReviewSearchService } from '@noctua.search/services/noctua-review-search.service';
import { NoctuaSearchDialogService } from '@noctua.search/services/dialog.service';

@Component({
    selector: 'noctua-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})

export class NoctuaToolbarComponent implements OnInit, OnDestroy {
    ActivityType = ActivityType;
    artBasket: ArtBasket
    public cam: Cam;
    userStatusOptions: any[];
    showLoadingBar: boolean;
    horizontalNav: boolean;
    noNav: boolean;
    navigation: any;
    noctuaFormUrl = '';
    loginUrl = '';
    logoutUrl = '';
    noctuaUrl = '';

    isBeta = environment.isBeta
    isDev = environment.isDev

    betaText = '';


    private _unsubscribeAll: Subject<any>;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private camService: CamService,
        private noctuaCommonMenuService: NoctuaCommonMenuService,
        public noctuaUserService: NoctuaUserService,
        private confirmDialogService: NoctuaConfirmDialogService,
        private noctuaSearchDialogService: NoctuaSearchDialogService,
        public noctuaConfigService: NoctuaFormConfigService,
        public noctuaActivityFormService: NoctuaActivityFormService,
        public noctuaFormMenuService: NoctuaFormMenuService,
        public noctuaReviewSearchService: NoctuaReviewSearchService,
    ) {
        const self = this;
        this._unsubscribeAll = new Subject();

        this.router.events.pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (event) => {
                    if (event instanceof NavigationStart) {
                        this.showLoadingBar = true;
                    }
                    if (event instanceof NavigationEnd) {
                        this.showLoadingBar = false;
                    }
                });
    }

    ngOnInit(): void {
        this.camService.onCamChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((cam) => {
                if (!cam) {
                    return;
                }

                this.cam = cam;
            });

        this.noctuaReviewSearchService.onArtBasketChanged.pipe(
            takeUntil(this._unsubscribeAll))
            .subscribe((artBasket: ArtBasket) => {
                if (artBasket) {
                    this.artBasket = artBasket;
                }
            });

        if (this.isDev && this.isBeta) {
            this.betaText = 'beta dev'
        } else if (this.isDev) {
            this.betaText = 'dev'
        } else if (this.isBeta) {
            this.betaText = 'beta'
        }
    }

    openApps() {
        this.noctuaCommonMenuService.openLeftSidenav();
    }

    openCamForm() {
        this.camService.initializeForm(this.cam);
        this.noctuaFormMenuService.openLeftDrawer(LeftPanel.camForm);
    }

    openActivityForm(activityType: ActivityType) {
        this.noctuaActivityFormService.setActivityType(activityType);
        this.noctuaFormMenuService.openLeftDrawer(LeftPanel.activityForm);
    }

    logout() {
        const self = this;

        const success = (logout) => {
            if (logout) {
                window.location.href = self.noctuaConfigService.logoutUrl;
            }
        };

        if (self.artBasket?.cams.length > 0) {
            this.noctuaSearchDialogService.openCamsUnsavedDialog(success);
        } else {
            window.location.href = self.noctuaConfigService.logoutUrl;
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


}
