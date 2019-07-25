import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NoctuaProgressBarService } from '@noctua/components/progress-bar/progress-bar.service';

@Component({
    selector: 'noctua-progress-bar',
    templateUrl: './progress-bar.component.html',
    styleUrls: ['./progress-bar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NoctuaProgressBarComponent implements OnInit, OnDestroy {
    bufferValue: number;
    mode: 'determinate' | 'indeterminate' | 'buffer' | 'query';
    value: number;
    visible: boolean;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _noctuaProgressBarService: NoctuaProgressBarService
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this._noctuaProgressBarService.bufferValue
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((bufferValue) => {
                this.bufferValue = bufferValue;
            });

        this._noctuaProgressBarService.mode
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((mode) => {
                this.mode = mode;
            });

        this._noctuaProgressBarService.value
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value) => {
                this.value = value;
            });

        this._noctuaProgressBarService.visible
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((visible) => {
                this.visible = visible;
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
