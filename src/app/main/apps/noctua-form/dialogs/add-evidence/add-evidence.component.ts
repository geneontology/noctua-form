
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { NoctuaFormConfigService } from 'noctua-form-base';


@Component({
  selector: 'app-add-evidence',
  templateUrl: './add-evidence.component.html',
  styleUrls: ['./add-evidence.component.scss']
})
export class AddEvidenceDialogComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;
  searchForm: FormGroup;
  searchFormData: any = {};
  cam: any = {};

  constructor(
    private _matDialogRef: MatDialogRef<AddEvidenceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    public noctuaFormConfigService: NoctuaFormConfigService,
  ) {
    this._unsubscribeAll = new Subject();

    this.cam = this._data.cam
    this.searchForm = this.createAnswerForm();
  }

  ngOnInit() {
  }

  close() {
    this._matDialogRef.close();
  }

  createAnswerForm() {
    return new FormGroup({
      annotatedEntity: new FormControl(this.cam.annotatedEntity.id),
      term: new FormControl(this.cam.term.id),
      evidence: new FormControl(this.cam.evidence.id),
      reference: new FormControl(this.cam.reference.label),
      with: new FormControl(this.cam.with),
    });
  }

  ngOnDestroy(): void {

    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}

