import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import {
    Cam,
    Contributor,
    CamService,
    NoctuaUserService,
    NoctuaFormConfigService,
    NoctuaGraphService,
    NoctuaAnnotonFormService,
    AnnotonType,
} from 'noctua-form-base';

import { NoctuaConfigService } from '@noctua/services/config.service';
import { NoctuaFormService } from 'app/main/apps/noctua-form/services/noctua-form.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Component({
    selector: 'noctua-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})

export class NoctuaToolbarComponent implements OnInit, OnDestroy {
    AnnotonType = AnnotonType;

    public user: Contributor;
    public cam: Cam;
    userStatusOptions: any[];
    showLoadingBar: boolean;
    horizontalNav: boolean;
    noNav: boolean;
    navigation: any;
    noctuaFormUrl = '';
    loginUrl = '';
    noctuaUrl = environment.noctuaUrl;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private camService: CamService,
        private noctuaConfig: NoctuaConfigService,
        private noctuaFormConfigService: NoctuaFormConfigService,
        private noctuaGraphService: NoctuaGraphService,
        public noctuaUserService: NoctuaUserService,
        public noctuaAnnotonFormService: NoctuaAnnotonFormService,
        public noctuaFormService: NoctuaFormService,
    ) {
        this._unsubscribeAll = new Subject();
        this.getUserInfo();

        this.route
            .queryParams
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(params => {
                const modelId = params['model_id'] || null;
                const noctuaFormUrl = `${environment.workbenchUrl}noctua-form/?model_id=${modelId}`;
                this.loginUrl = `${environment.globalBaristaLocation}/login?return=${noctuaFormUrl}`;
            });

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
    }

    createModel() {
        this.noctuaGraphService.createModel(this.cam);
    }

    getUserInfo() {
        const self = this;

        self.noctuaUserService.onUserChanged.pipe(
            takeUntil(this._unsubscribeAll))
            .subscribe((user: Contributor) => {
                if (user) {
                    self.user = user;
                }
            });
    }

    openCamForm() {
        this.camService.initializeForm(this.cam);
        this.noctuaFormService.openLeftDrawer(this.noctuaFormService.panel.camForm);
    }

    openAnnotonForm(annotonType: AnnotonType) {
        this.noctuaAnnotonFormService.setAnnotonType(annotonType);
        this.noctuaFormService.openLeftDrawer(this.noctuaFormService.panel.annotonForm);
    }




    search(value): void {
        console.log(value);
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
