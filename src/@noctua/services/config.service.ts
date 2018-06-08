import { Inject, Injectable, InjectionToken } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { BehaviorSubject } from 'rxjs';

import * as _ from 'lodash';

export const NOCTUA_CONFIG = new InjectionToken('noctuaCustomConfig');

@Injectable()
export class NoctuaConfigService {
    config: any;
    defaultConfig: any;
    isSetConfigRan = false;

    onConfigChanged: BehaviorSubject<any>;

    constructor(
        private router: Router,
        public platform: Platform,
        @Inject(NOCTUA_CONFIG) config
    ) {
        this.defaultConfig = config;

        if (this.platform.ANDROID || this.platform.IOS) {
            this.defaultConfig.customScrollbars = false;
        }

        this.config = _.cloneDeep(this.defaultConfig);

        router.events.subscribe(
            (event) => {
                if (event instanceof NavigationStart) {
                    this.isSetConfigRan = false;
                }

                if (event instanceof NavigationEnd) {
                    if (this.isSetConfigRan) {
                        return;
                    }

                    this.setConfig({
                        layout: this.defaultConfig.layout
                    }
                    );
                }
            }
        );

        this.onConfigChanged = new BehaviorSubject(this.config);
    }

    setConfig(config): void {
        this.isSetConfigRan = true;
        this.config = _.merge({}, this.config, config);
        this.onConfigChanged.next(this.config);
    }
}

