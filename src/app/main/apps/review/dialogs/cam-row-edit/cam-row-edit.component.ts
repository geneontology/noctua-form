import { Component, OnInit, OnDestroy, ViewChild, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatMenuTrigger } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { Cam } from '@noctua.sparql/models/cam';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'cam-row-edit-dialog',
  templateUrl: './cam-row-edit.component.html',
  styleUrls: ['./cam-row-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CamRowEditDialogComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;
  searchCriteria: any = {};
  searchForm: FormGroup;
  cam: Cam;

  constructor(
    private _matDialogRef: MatDialogRef<CamRowEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _matDialog: MatDialog,
    private route: ActivatedRoute) {
    this._unsubscribeAll = new Subject();

    this.searchForm = this.createAnswerForm();
  }

  ngOnInit() {
    this.cam = this._data.cam
  }

  close() {
    this._matDialogRef.close();
  }

  createAnswerForm() {
    return new FormGroup({
      goTerm: new FormControl(this.searchCriteria.goTerm),
      geneProduct: new FormControl(this.searchCriteria.geneProduct),
      pmid: new FormControl(this.searchCriteria.pmid),
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
