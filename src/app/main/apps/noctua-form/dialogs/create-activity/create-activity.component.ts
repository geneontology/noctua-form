import { Component, OnInit, OnDestroy, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { FormType, NoctuaActivityFormService, NoctuaFormConfigService } from '@geneontology/noctua-form-base';

@Component({
  selector: 'app-create-activity-dialog',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.scss']
})
export class CreateActivityDialogComponent implements OnInit, OnDestroy {
  FormType = FormType

  closeDialog: () => void;
  private _unsubscribeAll: Subject<any>;

  formType: FormType;

  constructor(
    private _matDialogRef: MatDialogRef<CreateActivityDialogComponent>,
    private activityFormService: NoctuaActivityFormService,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    public noctuaFormConfigService: NoctuaFormConfigService) {
    this.closeDialog = this.close.bind(this);
    this._unsubscribeAll = new Subject();
    this.formType = _data.formType;
  }

  ngOnInit() {

  }

  close() {
    this._matDialogRef.close();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
