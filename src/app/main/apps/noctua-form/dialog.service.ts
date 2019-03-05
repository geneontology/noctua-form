import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatDialog, MatDialogRef } from '@angular/material';
import { CamRowEditDialogComponent } from './dialogs/cam-row-edit/cam-row-edit.component';

import { AnnotonErrorsDialogComponent } from './dialogs/annoton-errors/annoton-errors.component';
import { BeforeSaveDialogComponent } from './dialogs/before-save/before-save.component';
import { CreateFromExistingDialogComponent } from './dialogs/create-from-existing/create-from-existing.component';
import { LinkToExistingDialogComponent } from './dialogs/link-to-existing/link-to-existing.component';
import { SelectEvidenceDialogComponent } from './dialogs/select-evidence/select-evidence.component';
import { SearchDatabaseDialogComponent } from './dialogs/search-database/search-database.component';
import { CamConnectorDialogComponent } from './dialogs/cam-connector/cam-connector.component';

import 'rxjs/add/operator/map';


@Injectable()
export class NoctuaFormDialogService {
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

    openAnnotonErrorsDialog(cam): void {
        this.dialogRef = this._matDialog.open(AnnotonErrorsDialogComponent, {
            panelClass: 'annoton-errors-dialog',
            data: {
                cam: cam
            }
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {

            });
    }

    openBeforeSaveDialog(cam): void {
        this.dialogRef = this._matDialog.open(BeforeSaveDialogComponent, {
            panelClass: 'before-save-dialog',
            data: {
                cam: cam
            }
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {

            });
    }

    openCamConnector(cam): void {
        this.dialogRef = this._matDialog.open(CamConnectorDialogComponent, {
            panelClass: 'cam-connector-dialog',
            data: {
                cam: cam
            }
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {

            });
    }

    openCreateFromExistingDialog(cam): void {
        this.dialogRef = this._matDialog.open(CreateFromExistingDialogComponent, {
            panelClass: 'create-from-existing-dialog',
            data: {
                cam: cam
            }
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {

            });
    }
    openLinkToExistingDialogComponent(cam): void {
        this.dialogRef = this._matDialog.open(LinkToExistingDialogComponent, {
            panelClass: 'link-to-existing-dialog',
            data: {
                cam: cam
            }
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {

            });
    }
    openSelectEvidenceDialog(cam): void {
        this.dialogRef = this._matDialog.open(SelectEvidenceDialogComponent, {
            panelClass: 'select-evidence-dialog',
            data: {
                cam: cam
            }
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {

            });
    }
    openSearchDatabaseDialog(cam): void {
        this.dialogRef = this._matDialog.open(SearchDatabaseDialogComponent, {
            panelClass: 'search-database-dialog',
            data: {
                cam: cam
            }
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {

            });
    }
}
