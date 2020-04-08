
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';

import {
  AnnotonNode,
  Evidence,
  NoctuaFormConfigService,
  NoctuaLookupService
} from 'noctua-form-base';

import { noctuaAnimations } from './../../../../../../@noctua/animations';

@Component({
  selector: 'app-search-database',
  templateUrl: './search-database.component.html',
  styleUrls: ['./search-database.component.scss'],
  animations: noctuaAnimations
})
export class SearchDatabaseDialogComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;
  evidence: Evidence[] = [];
  annotonNodes: AnnotonNode[] = [];
  selectedAnnotonNode: AnnotonNode;
  searchCriteria: any;
  displayedColumns: string[] = ['select', 'evidence', 'reference', 'with', 'assignedBy'];
  dataSource;
  selection = new SelectionModel<Evidence>(true, []);

  constructor(
    private _matDialogRef: MatDialogRef<SearchDatabaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    public noctuaFormConfigService: NoctuaFormConfigService,
    private noctuaLookupService: NoctuaLookupService,
  ) {
    this._unsubscribeAll = new Subject();

    this.evidence = this._data.evidence;
    this.searchCriteria = this._data.searchCriteria;
    this.initialize();

  }
  ngOnInit() {
  }
  initialize() {
    const self = this;

    self.noctuaLookupService.companionLookup(
      this.searchCriteria.gpNode.id,
      this.searchCriteria.aspect,
      this.searchCriteria.params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        console.log(response);
        this.annotonNodes = response;
      });
  }

  selectAnnotonNode(annotonNode: AnnotonNode) {
    this.selectedAnnotonNode = annotonNode;
    this.dataSource = new MatTableDataSource<Evidence>(annotonNode.predicate.evidence);
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
      term: this.selectedAnnotonNode,
      evidences: <Evidence[]>this.selection.selected
    });
  }

  close() {
    this._matDialogRef.close();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
