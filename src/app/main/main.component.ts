import { Component, ElementRef, HostBinding, Inject, OnDestroy, Renderer2, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { Subscription } from 'rxjs';

import { NoctuaConfigService } from '@noctua/services/config.service';

@Component({
    selector: 'noctua-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NoctuaMainComponent implements OnDestroy {
    onConfigChanged: Subscription;
    noctuaSettings: any;
    navigation: any;

    @HostBinding('attr.noctua-layout-mode') layoutMode;

    constructor(
        private _renderer: Renderer2,
        private _elementRef: ElementRef,
        private noctuaConfig: NoctuaConfigService,
        private platform: Platform,
        @Inject(DOCUMENT) private document: any
    ) {
        this.onConfigChanged =
            this.noctuaConfig.onConfigChanged
                .subscribe(
                    (newSettings) => {
                        this.noctuaSettings = newSettings;
                    }
                );

        if (this.platform.ANDROID || this.platform.IOS) {
            this.document.body.className += ' is-mobile';
        }

    }

    ngOnDestroy() {
        this.onConfigChanged.unsubscribe();
    }

    addClass(className: string) {
        this._renderer.addClass(this._elementRef.nativeElement, className);
    }

    removeClass(className: string) {
        this._renderer.removeClass(this._elementRef.nativeElement, className);
    }
}
