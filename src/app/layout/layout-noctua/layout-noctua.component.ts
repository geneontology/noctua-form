import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NoctuaConfigService } from '@noctua/services/config.service';

@Component({
    selector: 'layout-noctua',
    templateUrl: './layout-noctua.component.html',
    styleUrls: ['./layout-noctua.component.scss'],
    encapsulation: ViewEncapsulation.None
}

) export class LayoutNoctuaComponent implements OnInit, OnDestroy {
    noctuaConfig: any;
    navigation: any;
    private _unsubscribeAll: Subject<any>;

    constructor(private _noctuaConfigService: NoctuaConfigService) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this._noctuaConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.noctuaConfig = config;
            });
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}