import { Injectable, NgZone } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';





@Injectable({
    providedIn: 'root'
})
export class NoctuaAnnotationsDialogService {

    dialogRef: any;

    constructor(
        private zone: NgZone,
        private snackBar: MatSnackBar,
        private _matDialog: MatDialog) {
    }

    openInfoToast(message: string, action: string) {
        this.zone.run(() => {
            this.snackBar.open(message, action, {
                duration: 10000,
                verticalPosition: 'top'
            });
        });

    }
}
