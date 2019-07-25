
import { Component, OnInit, OnDestroy, ViewChild, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatMenuTrigger, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import {
  Evidence,
  NoctuaFormConfigService,
  NoctuaGraphService,
  NoctuaLookupService
} from 'noctua-form-base';

import { NoctuaSearchService } from './../../../../../../@noctua.search/services/noctua-search.service';
import { SparqlService } from './../../../../../../@noctua.sparql/services/sparql/sparql.service';
import { noctuaAnimations } from '@noctua/animations';

@Component({
  selector: 'app-select-evidence',
  templateUrl: './select-evidence.component.html',
  styleUrls: ['./select-evidence.component.scss'],
  animations: noctuaAnimations
})
export class SelectEvidenceDialogComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;
  evidence: Evidence[] = [];
  displayedColumns: string[] = ['select', 'evidence', 'reference', 'with'];
  dataSource;
  selection = new SelectionModel<Evidence>(true, []);

  constructor(
    private _matDialogRef: MatDialogRef<SelectEvidenceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _matDialog: MatDialog,
    private route: ActivatedRoute,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaSearchService: NoctuaSearchService,
    private noctuaLookupService: NoctuaLookupService,
    private noctuaGraphService: NoctuaGraphService,
    private sparqlService: SparqlService,
  ) {
    this._unsubscribeAll = new Subject();

    this.evidence = this._data.evidence;
    this.dataSource = new MatTableDataSource<Evidence>(this.evidence);

  }

  ngOnInit() {
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  save() {
    this._matDialogRef.close({
      evidences: <Evidence[]>this.selection.selected
    });
  }

  close() {
    this._matDialogRef.close();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
