import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'noctua-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class NoctuaConfirmDialogComponent {
    public confirmMessage: string;

    constructor(public dialogRef: MatDialogRef<NoctuaConfirmDialogComponent>) {
    }
}
