import { Component, HostBinding, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { noctuaAnimations } from '@noctua/animations/index';
import { NoctuaConfigService } from '@noctua/services/config.service';

@Component({
    selector   : 'noctua-content',
    templateUrl: './content.component.html',
    styleUrls  : ['./content.component.scss'],
    animations : noctuaAnimations
})
export class NoctuaContentComponent implements OnDestroy
{
    onConfigChanged: Subscription;
    noctuaSettings: any;

    @HostBinding('@routerTransitionUp') routeAnimationUp = false;
    @HostBinding('@routerTransitionDown') routeAnimationDown = false;
    @HostBinding('@routerTransitionRight') routeAnimationRight = false;
    @HostBinding('@routerTransitionLeft') routeAnimationLeft = false;
    @HostBinding('@routerTransitionFade') routeAnimationFade = false;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private noctuaConfig: NoctuaConfigService
    )
    {
        this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            map(() => this.activatedRoute)
        ).subscribe((event) => {
            switch ( this.noctuaSettings.routerAnimation )
            {
                case 'fadeIn':
                    this.routeAnimationFade = !this.routeAnimationFade;
                    break;
                case 'slideUp':
                    this.routeAnimationUp = !this.routeAnimationUp;
                    break;
                case 'slideDown':
                    this.routeAnimationDown = !this.routeAnimationDown;
                    break;
                case 'slideRight':
                    this.routeAnimationRight = !this.routeAnimationRight;
                    break;
                case 'slideLeft':
                    this.routeAnimationLeft = !this.routeAnimationLeft;
                    break;
            }
        });

        this.onConfigChanged =
            this.noctuaConfig.onConfigChanged
                .subscribe(
                    (newSettings) => {
                        this.noctuaSettings = newSettings;
                    }
                );
    }

    ngOnDestroy()
    {
        this.onConfigChanged.unsubscribe();
    }
}
