import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatDialog, MatDialogRef } from '@angular/material';
import { CamRowEditDialogComponent } from './dialogs/cam-row-edit/cam-row-edit.component';

import 'rxjs/add/operator/map';


@Injectable()
export class ReviewDialogService {
    dialogRef: any;

    constructor(private httpClient: HttpClient,
        private _matDialog: MatDialog) {
    }

    openCamRowEdit(cam): void {
        this.dialogRef = this._matDialog.open(CamRowEditDialogComponent, {
            panelClass: 'cam-row-edit-dialog',
            data: {
                cam: cam
            }
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {

            });
    }
}
