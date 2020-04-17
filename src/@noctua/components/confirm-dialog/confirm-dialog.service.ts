import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NoctuaConfirmDialogComponent } from '@noctua/components/confirm-dialog/confirm-dialog.component';


@Injectable({
    providedIn: 'root'
})
export class NoctuaConfirmDialogService {

    dialogRef: any;

    constructor(
        private _matDialog: MatDialog) {
    }

    openConfirmDialog(title, message, success): void {
        let confirmDialogRef: MatDialogRef<NoctuaConfirmDialogComponent> = this._matDialog.open(NoctuaConfirmDialogComponent, {
            panelClass: 'noc-confirm-dialog',
            disableClose: false,
            width: '600px',
        });

        confirmDialogRef.componentInstance.title = title;
        confirmDialogRef.componentInstance.message = message;
        if (!success) {
            confirmDialogRef.componentInstance.readonlyDialog = true;
        }

        confirmDialogRef.afterClosed().subscribe(response => {
            if (response) {
                success(response);
            }
            confirmDialogRef = null;
        });
    }
}
