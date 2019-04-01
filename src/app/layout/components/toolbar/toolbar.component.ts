import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import {
    Cam,
    Curator,
    NoctuaUserService,
    NoctuaFormConfigService,
    NoctuaGraphService,
    NoctuaAnnotonFormService,
    CamService
} from 'noctua-form-base';

import { NoctuaConfigService } from '@noctua/services/config.service';

@Component({
    selector: 'noctua-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})

export class NoctuaToolbarComponent implements OnInit {
    public user: Curator;
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
        private noctuaConfig: NoctuaConfigService,
        public noctuaUserService: NoctuaUserService,
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

    search(value): void {
        console.log(value);
    }

    setLanguage(lang) {
        this.selectedLanguage = lang;
        this.translate.use(lang.id);
    }
}
