import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'noctua-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class NoctuaConfirmDialogComponent {
    public title: string;
    public message: string;
    public readonlyDialog = false;

    constructor(public dialogRef: MatDialogRef<NoctuaConfirmDialogComponent>) {
    }

    confirm() {
        this.dialogRef.close(true);
    }

    cancel() {
        this.dialogRef.close(false);
    }
}
