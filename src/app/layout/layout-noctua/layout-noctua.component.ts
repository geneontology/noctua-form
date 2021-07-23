import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NoctuaConfigService } from '@noctua/services/config.service';
import { MatSidenav } from '@angular/material/sidenav';
import { NoctuaCommonMenuService } from '@noctua.common/services/noctua-common-menu.service';

@Component({
    selector: 'layout-noctua',
    templateUrl: './layout-noctua.component.html',
    styleUrls: ['./layout-noctua.component.scss'],
    encapsulation: ViewEncapsulation.None
}

) export class LayoutNoctuaComponent implements OnInit, OnDestroy {
    noctuaConfig: any;
    navigation: any;
    @ViewChild('leftSidenav', { static: true })
    leftSidenav: MatSidenav;
    private _unsubscribeAll: Subject<any>;

    constructor(private _noctuaConfigService: NoctuaConfigService,
        public noctuaCommonMenuService: NoctuaCommonMenuService) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this._noctuaConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.noctuaConfig = config;
            });
        this.noctuaCommonMenuService.setLeftSidenav(this.leftSidenav);
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}