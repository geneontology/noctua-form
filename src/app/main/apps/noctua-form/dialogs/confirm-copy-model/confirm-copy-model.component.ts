
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Cam, NoctuaFormConfigService } from '@geneontology/noctua-form-base';


@Component({
  selector: 'app-confirm-copy-model',
  templateUrl: './confirm-copy-model.component.html',
  styleUrls: ['./confirm-copy-model.component.scss']
})
export class ConfirmCopyModelDialogComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;
  camForm: FormGroup;
  cam: Cam

  constructor(
    private _matDialogRef: MatDialogRef<ConfirmCopyModelDialogComponent>,
    public noctuaFormConfigService: NoctuaFormConfigService,
    @Inject(MAT_DIALOG_DATA) private _data: any,
  ) {
    this._unsubscribeAll = new Subject();
    this.cam = _data.cam

    this.camForm = this.createCamForm(this.cam);
  }

  ngOnInit() { }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  createCamForm(cam: Cam) {
    return new FormGroup({
      title: new FormControl('Copy of ' + cam?.title),
    });
  }


  save() {
    const value = this.camForm.value
    this._matDialogRef.close(value);
  }

  close() {
    this._matDialogRef.close();
  }
}
