
import { Component, OnInit, OnDestroy, Inject, Input, Output, EventEmitter } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';

import {
  Evidence,
  NoctuaFormConfigService
} from 'noctua-form-base';

import { noctuaAnimations } from '@noctua/animations';

@Component({
  selector: 'noc-select-evidence',
  templateUrl: './select-evidence.component.html',
  styleUrls: ['./select-evidence.component.scss'],
  animations: noctuaAnimations
})
export class SelectEvidenceComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;

  @Input('evidence') evidence: Evidence[];

  @Output()
  onSelectionChanged: EventEmitter<any> = new EventEmitter<any>();

  displayedColumns: string[] = ['select', 'evidence', 'reference', 'with', 'assignedBy'];
  dataSource;
  selection = new SelectionModel<Evidence>(true, []);

  constructor(
    public noctuaFormConfigService: NoctuaFormConfigService,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Evidence>(this.evidence);
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

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
