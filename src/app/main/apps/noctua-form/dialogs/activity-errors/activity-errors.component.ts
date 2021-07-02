import { Component, OnInit, OnDestroy, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { ErrorLevel, ErrorType, NoctuaFormConfigService } from 'noctua-form-base';



@Component({
  selector: 'app-activity-errors',
  templateUrl: './activity-errors.component.html',
  styleUrls: ['./activity-errors.component.scss']
})
export class ActivityErrorsDialogComponent implements OnInit, OnDestroy {
  ErrorType = ErrorType;
  ErrorLevel = ErrorLevel;
  private _unsubscribeAll: Subject<any>;
  errors

  constructor(
    private _matDialogRef: MatDialogRef<ActivityErrorsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    public noctuaFormConfigService: NoctuaFormConfigService) {
    this._unsubscribeAll = new Subject();

    this.errors = this._data.errors

  }

  ngOnInit() {
  }

  close() {
    this._matDialogRef.close();
  }



  ngOnDestroy(): void {

    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
