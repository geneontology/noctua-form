import { environment } from '../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AnnotonErrorsDialogComponent } from './../dialogs/annoton-errors/annoton-errors.component';
import { BeforeSaveDialogComponent } from './../dialogs/before-save/before-save.component';
import { CreateFromExistingDialogComponent } from './../dialogs/create-from-existing/create-from-existing.component';
import { LinkToExistingDialogComponent } from './../dialogs/link-to-existing/link-to-existing.component';
import { SelectEvidenceDialogComponent } from './../dialogs/select-evidence/select-evidence.component';
import { SearchDatabaseDialogComponent } from './../dialogs/search-database/search-database.component';

import {
    Evidence, AnnotonNode
} from 'noctua-form-base';

import 'rxjs/add/operator/map';
import { NoctuaConfirmDialogComponent } from '@noctua/components/confirm-dialog/confirm-dialog.component';
import { PreviewAnnotonDialogComponent } from '../dialogs/preview-annoton/preview-annoton.component';
import { SearchEvidenceDialogComponent } from '../dialogs/search-evidence/search-evidence.component';


@Injectable({
    providedIn: 'root'
})
export class NoctuaFormDialogService {

    dialogRef: any;

    constructor(private httpClient: HttpClient,
        private snackBar: MatSnackBar,
        private _matDialog: MatDialog) {
    }

    openSuccessfulSaveToast(message: string, action: string) {
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


    openAnnotonErrorsDialog(errors: any[]): void {
        this.dialogRef = this._matDialog.open(AnnotonErrorsDialogComponent, {
            panelClass: 'annoton-errors-dialog',
            data: {
                errors: errors
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

    openLinkToExistingDialogComponent(data, success): void {
        this.dialogRef = this._matDialog.open(LinkToExistingDialogComponent, {
            panelClass: 'noc-link-to-existing-dialog',
            data
        });
        this.dialogRef.afterClosed()
            .subscribe((response) => {
                success(response);
            });
    }

    openSelectEvidenceDialog(evidence: Evidence[], success): void {
        this.dialogRef = this._matDialog.open(SelectEvidenceDialogComponent, {
            panelClass: 'noc-select-evidence-dialog',
            data: {
                evidence: evidence
            }
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (response) {
                    success(response);
                }
            });
    }

    openSearchDatabaseDialog(searchCriteria, success): void {
        this.dialogRef = this._matDialog.open(SearchDatabaseDialogComponent, {
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

    openSearchEvidenceDialog(searchCriteria, success): void {
        this.dialogRef = this._matDialog.open(SearchEvidenceDialogComponent, {
            panelClass: 'noc-search-evidence-dialog',
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

    openPreviewAnnotonDialog(): void {
        this.dialogRef = this._matDialog.open(PreviewAnnotonDialogComponent, {
            panelClass: 'noc-preview-annoton-dialog',
            width: '600px',
        });
    }
}
