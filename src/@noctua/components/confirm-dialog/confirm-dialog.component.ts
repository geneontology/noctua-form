import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'noctua-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class NoctuaConfirmDialogComponent {
    public title: string;
    public message: string;
    public readonlyDialog = false;
    public cancelLabel = 'Cancel'
    public confirmLabel = 'Confirm'

    constructor(public dialogRef: MatDialogRef<NoctuaConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any) {
        if (_data) {
            this.cancelLabel = _data.cancelLabel ? _data.cancelLabel : 'Cancel';
            this.confirmLabel = _data.confirmLabel ? _data.confirmLabel : 'Confirm';
        }
    }

    confirm() {
        this.dialogRef.close(true);
    }

    cancel() {
        this.dialogRef.close(false);
    }
}
