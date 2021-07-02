import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GraphSettingsDialogComponent } from '../dialogs/graph-settings/graph-settings.component';

@Injectable({
    providedIn: 'root'
})
export class NoctuaGraphDialogService {

    dialogRef: any;

    constructor(
        private snackBar: MatSnackBar,
        private _matDialog: MatDialog) {
    }

    openGraphSettingsDialog(): void {
        this.dialogRef = this._matDialog.open(GraphSettingsDialogComponent, {
            panelClass: 'noc-search-database-dialog',

            width: '600px',
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (response) {
                    // success(response);
                }
            });
    }
}
