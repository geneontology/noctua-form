import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatDialog, MatDialogRef } from '@angular/material';

import 'rxjs/add/operator/map';

@Injectable({
    providedIn: 'root'
})
export class ReviewDialogService {
    dialogRef: any;

    constructor(private httpClient: HttpClient,
        private _matDialog: MatDialog) {
    }


}
