import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NoctuaConfirmDialogComponent } from '@noctua/components/confirm-dialog/confirm-dialog.component';
import { CamsReviewChangesDialogComponent } from './../components/dialogs/cams-review-changes/cams-review-changes.component';
import { CamsUnsavedDialogComponent } from '@noctua.search/components/dialogs/cams-unsaved/cams-unsaved.component';

@Injectable({
    providedIn: 'root'
})
export class NoctuaSearchDialogService {

    dialogRef: any;

    constructor(
        private snackBar: MatSnackBar,
        private _matDialog: MatDialog) {
    }

    openInfoToast(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 10000,
            verticalPosition: 'top'
        });
    }

    openConfirmDialog(searchCriteria, success): void {
        this.dialogRef = this._matDialog.open(NoctuaConfirmDialogComponent, {
            panelClass: 'noc-search-database-dialog',
            data: {
                searchCriteria: searchCriteria
            },
            width: '600px',
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (response) {
                    success(response);
                }
            });
    }



    openCamReviewChangesDialog(success, summary, options?): void {
        let dialogRef: MatDialogRef<CamsReviewChangesDialogComponent> = this._matDialog.open(CamsReviewChangesDialogComponent, {
            panelClass: 'noc-cams-review-changes-dialog',
            data: {
                summary: summary,
                options: options
            },
        });

        if (options && options.title) {
            dialogRef.componentInstance.title = options.title;
        }
        if (options && options.message) {
            dialogRef.componentInstance.message = options.message;
        }
        if (!success) {
            dialogRef.componentInstance.readonlyDialog = true;
        }

        dialogRef.afterClosed()
            .subscribe(response => {
                if (response) {
                    success(response);
                }

                dialogRef = null;
            });
    }

    openCamsUnsavedDialog(success): void {
        this.dialogRef = this._matDialog.open(CamsUnsavedDialogComponent, {
            panelClass: 'noc-cams-unsaved-dialog',
            data: {
                // searchCriteria: searchCriteria
            },
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (response) {
                    success(response);
                }
            });
    }
}
