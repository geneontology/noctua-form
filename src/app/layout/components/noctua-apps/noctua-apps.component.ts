import { Component, OnDestroy, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Cam, CamService, NoctuaUserService, NoctuaFormConfigService } from 'noctua-form-base';
import { MatSidenav } from '@angular/material/sidenav';
import { NoctuaCommonMenuService } from '@noctua.common/services/noctua-common-menu.service';

@Component({
    selector: 'noc-noctua-apps',
    templateUrl: './noctua-apps.component.html',
    styleUrls: ['./noctua-apps.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NoctuaAppsComponent implements OnInit, OnDestroy {
    @Input('sidenav')
    sidenav: MatSidenav;

    public cam: Cam;
    date: Date;

    private _unsubscribeAll: Subject<any>;

    constructor(
        public noctuaConfigService: NoctuaFormConfigService,
        private noctuaCommonMenuService: NoctuaCommonMenuService,
        private camService: CamService,
        public noctuaUserService: NoctuaUserService,
    ) {
        this.date = new Date();
        this._unsubscribeAll = new Subject();
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

    createModel(type: 'graph-editor' | 'noctua-form') {
        this.noctuaCommonMenuService.createModel(type);
    }

    close() {
        this.sidenav.close();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
