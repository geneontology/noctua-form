import { Component, ElementRef, HostBinding, Inject, OnInit, OnDestroy, Renderer2, ViewEncapsulation, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NoctuaConfigService } from '@noctua/services/config.service';
import { NoctuaSplashScreenService } from '@noctua/services/splash-screen.service';
import { NoctuaUserService } from 'noctua-form-base';


@Component({
    selector: 'noctua-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
    noctuaConfig: any;
    navigation: any;

    private _unsubscribeAll: Subject<any>;
    @HostListener('window:focus', ['$event'])
    onFocus(event: FocusEvent): void {
        this.noctuaUserService.getUser();
    }

    constructor(
        private noctuaSplashScreen: NoctuaSplashScreenService,
        private _renderer: Renderer2,
        private _elementRef: ElementRef,
        private noctuaConfigService: NoctuaConfigService,
        public noctuaUserService: NoctuaUserService,
        private platform: Platform,
        @Inject(DOCUMENT) private document: any
    ) {
        if (this.platform.ANDROID || this.platform.IOS) {
            this.document.body.className += ' is-mobile';
        }

        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.noctuaConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.noctuaConfig = config;
            });
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    addClass(className: string) {
        this._renderer.addClass(this._elementRef.nativeElement, className);
    }

    removeClass(className: string) {
        this._renderer.removeClass(this._elementRef.nativeElement, className);
    }
}
