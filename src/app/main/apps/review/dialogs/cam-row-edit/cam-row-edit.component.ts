import { Component, OnInit, OnDestroy, ViewChild, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatMenuTrigger } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'cam-row-edit-dialog',
  templateUrl: './cam-row-edit.component.html',
  styleUrls: ['./cam-row-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CamRowEditDialogComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _matDialogRef: MatDialogRef<CamRowEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _matDialog: MatDialog,
    private route: ActivatedRoute) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    // this.ptn = this._data.ptn
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
