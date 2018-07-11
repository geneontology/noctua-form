import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

@Component({
    selector: 'noctua-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class NoctuaSearchBarComponent implements OnInit, OnDestroy {
    collapsed: boolean;
    noctuaConfig: any;

    @Output()
    input: EventEmitter<any>;

    private _unsubscribeAll: Subject<any>;

    constructor() {
        this.input = new EventEmitter();
        this.collapsed = true;
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void { }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    collapse(): void {
        this.collapsed = true;
    }

    expand(): void {
        this.collapsed = false;
    }

    search(event): void {
        this.input.emit(event.target.value);
    }
}
