import { Component, EventEmitter, OnDestroy, OnInit, Output, ElementRef, ViewChild } from '@angular/core';
import { Overlay, OverlayConfig, OriginConnectionPosition, OverlayConnectionPosition } from '@angular/cdk/overlay';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SearchBarService, AdvancedSearchDialogConfig } from './search-bar.service';

import { SparqlService } from '@noctua.sparql/services/sparql/sparql.service';

@Component({
    selector: 'noctua-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class NoctuaSearchBarComponent implements OnInit, OnDestroy {
    collapsed: boolean;
    noctuaConfig: any;

    @ViewChild('advancedSearchTrigger', { read: ElementRef })
    private advancedSearchTrigger: ElementRef;

    @Output()
    input: EventEmitter<any>;

    private _unsubscribeAll: Subject<any>;

    constructor(private searchBarService: SearchBarService) {
        this.input = new EventEmitter();
        this.collapsed = true;
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void { }

    openAdvancedSearch() {
        const data = {
            data: 'poo',
        };
        this.searchBarService.open(this.advancedSearchTrigger, data);
    }

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
