import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

import {
    Cam,
    CamService,
    NoctuaUserService,
    NoctuaFormConfigService,
    NoctuaActivityFormService,
    ActivityType,
    LeftPanel,
} from '@geneontology/noctua-form-base';
import { LeftPanel as CommonLeftPanel } from '@noctua.common/models/menu-panels';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { NoctuaCommonMenuService } from '@noctua.common/services/noctua-common-menu.service';
import { ArtBasket } from '@noctua.search/models/art-basket';
import { NoctuaReviewSearchService } from '@noctua.search/services/noctua-review-search.service';
import { NoctuaSearchDialogService } from '@noctua.search/services/dialog.service';
import { NoctuaAnnouncementService } from '@noctua.announcement/services/cam.service';
import { Announcement } from '@noctua.announcement/models/announcement';
import { NoctuaSearchMenuService } from '@noctua.search/services/search-menu.service';

@Component({
    selector: 'noctua-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})

export class NoctuaToolbarComponent implements OnInit, OnDestroy {
    ActivityType = ActivityType;
    artBasket: ArtBasket
    announcements: Announcement[];
    announcement: Announcement;
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
        private camService: CamService,
        private noctuaCommonMenuService: NoctuaCommonMenuService,
        private noctuaAnnouncementService: NoctuaAnnouncementService,
        public noctuaUserService: NoctuaUserService,
        private noctuaSearchDialogService: NoctuaSearchDialogService,
        public noctuaConfigService: NoctuaFormConfigService,
        public noctuaActivityFormService: NoctuaActivityFormService,
        public noctuaReviewSearchService: NoctuaReviewSearchService,
        public noctuaSearchMenuService: NoctuaSearchMenuService,
    ) {
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
        //this.noctuaAnnouncementService.getAnnouncement();
        this.camService.onCamChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((cam) => {
                if (!cam) {
                    return;
                }

                this.cam = cam;
            });

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
        this.noctuaAnnouncementService.onAnnouncementsChanged.pipe(
            takeUntil(this._unsubscribeAll))
            .subscribe((announcements: Announcement[]) => {
                if (announcements) {
                    this.announcements = announcements
                }
            });

        this.noctuaAnnouncementService.onAnnouncementChanged.pipe(
            takeUntil(this._unsubscribeAll))
            .subscribe((announcement: Announcement) => {
                if (announcement) {
                    this.announcement = announcement
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
        this.noctuaCommonMenuService.selectLeftSidenav(CommonLeftPanel.apps)
        this.noctuaCommonMenuService.openLeftSidenav();
    }

    openAnnouncements() {
        this.noctuaCommonMenuService.selectLeftSidenav(CommonLeftPanel.announcement)
        this.noctuaCommonMenuService.openLeftSidenav();
    }

    openCamForm() {
        this.camService.initializeForm(this.cam);
        this.noctuaCommonMenuService.selectLeftPanel(LeftPanel.camForm);
        this.noctuaCommonMenuService.openLeftDrawer();
    }

    openActivityForm(activityType: ActivityType) {
        this.noctuaActivityFormService.setActivityType(activityType);
        this.noctuaCommonMenuService.selectLeftPanel(LeftPanel.activityForm);
        this.noctuaCommonMenuService.openLeftDrawer();
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
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
