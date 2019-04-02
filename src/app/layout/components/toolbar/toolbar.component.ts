import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import {
    Cam,
    Curator,
    CamService,
    NoctuaUserService,
    NoctuaFormConfigService,
    NoctuaGraphService,
    NoctuaAnnotonFormService,
} from 'noctua-form-base';

import { NoctuaConfigService } from '@noctua/services/config.service';
import { NoctuaFormService } from 'app/main/apps/noctua-form/services/noctua-form.service';

@Component({
    selector: 'noctua-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})

export class NoctuaToolbarComponent implements OnInit {
    public user: Curator;
    public cam: Cam;
    userStatusOptions: any[];
    languages: any;
    selectedLanguage: any;
    showLoadingBar: boolean;
    horizontalNav: boolean;
    noNav: boolean;
    navigation: any;

    loginUrl;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private camService: CamService,
        private noctuaConfig: NoctuaConfigService,
        public noctuaUserService: NoctuaUserService,
        public noctuaAnnotonFormService: NoctuaAnnotonFormService,
        public noctuaFormService: NoctuaFormService,
        private translate: TranslateService
    ) {
        console.log(window.location)
        this.loginUrl = 'http://barista-dev.berkeleybop.org/login?return=' + window.location.origin;
        this.languages = [{
            'id': 'en',
            'title': 'English',
            'flag': 'us'
        }, {
            'id': 'tr',
            'title': 'Turkish',
            'flag': 'tr'
        }];

        this.selectedLanguage = this.languages[0];

        this.route
            .queryParams
            .subscribe(params => {
                // Defaults to 0 if no query param provided.
            });

        this.getUserInfo();
        this.router.events.subscribe(
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
        this.camService.onCamChanged.subscribe((cam) => {
            if (!cam) return;

            this.cam = cam
            this.cam.onGraphChanged.subscribe((annotons) => {
            });
        });
    }

    getUserInfo() {
        const self = this;

        this.noctuaUserService.onUserChanged.subscribe((response) => {
            if (response) {
                this.user = new Curator()
                this.user.name = response.nickname;
                this.user.groups = response.groups;
            }
        });
    }

    addAnnoton() {
        this.openAnnotonForm(location);
    }

    openCamForm() {
        //  this.noctuaFormService.initializeForm();
        this.noctuaFormService.openRightDrawer(this.noctuaFormService.panel.camForm)
    }

    openAnnotonForm(location?) {
        this.noctuaAnnotonFormService.initializeForm();
        this.noctuaFormService.openRightDrawer(this.noctuaFormService.panel.annotonForm)
    }

    search(value): void {
        console.log(value);
    }

    setLanguage(lang) {
        this.selectedLanguage = lang;
        this.translate.use(lang.id);
    }
}
