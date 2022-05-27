import { environment } from '../../../../../environments/environment';
import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivityErrorsDialogComponent } from './../dialogs/activity-errors/activity-errors.component';
import { BeforeSaveDialogComponent } from './../dialogs/before-save/before-save.component';
import { CreateFromExistingDialogComponent } from './../dialogs/create-from-existing/create-from-existing.component';
import { LinkToExistingDialogComponent } from './../dialogs/link-to-existing/link-to-existing.component';
import { SelectEvidenceDialogComponent } from './../dialogs/select-evidence/select-evidence.component';
import { SearchDatabaseDialogComponent } from './../dialogs/search-database/search-database.component';

import {
    Evidence, ActivityNode, Activity, FormType
} from '@geneontology/noctua-form-base';

import 'rxjs/add/operator/map';
import { NoctuaConfirmDialogComponent } from '@noctua/components/confirm-dialog/confirm-dialog.component';
import { PreviewActivityDialogComponent } from '../dialogs/preview-activity/preview-activity.component';
import { SearchEvidenceDialogComponent } from '../dialogs/search-evidence/search-evidence.component';
import { CamErrorsDialogComponent } from '../dialogs/cam-errors/cam-errors.component';
import { CreateActivityDialogComponent } from '../dialogs/create-activity/create-activity.component';
import { AddEvidenceDialogComponent } from '../dialogs/add-evidence/add-evidence.component';


@Injectable({
    providedIn: 'root'
})
export class NoctuaFormDialogService {

    dialogRef: any;

    constructor(private httpClient: HttpClient,
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


    openCreateActivityDialog(formType: FormType): void {
        this.dialogRef = this._matDialog.open(CreateActivityDialogComponent, {
            panelClass: 'noc-activity-create-dialog',
            data: {
                formType
            }
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {

            });
    }

    openActivityErrorsDialog(errors: any[]): void {
        this.dialogRef = this._matDialog.open(ActivityErrorsDialogComponent, {
            panelClass: 'activity-errors-dialog',
            data: {
                errors: errors
            }
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {

            });
    }

    openCamErrorsDialog(errors: any[]): void {
        this.dialogRef = this._matDialog.open(CamErrorsDialogComponent, {
            panelClass: 'cam-errors-dialog',
            data: {
                errors: errors
            }
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {

            });
    }

    openAddEvidenceDialog(success): void {
        this.dialogRef = this._matDialog.open(AddEvidenceDialogComponent, {
            panelClass: 'noc-add-evidence-dialog',
            data: {
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

    openPreviewActivityDialog(): void {
        this.dialogRef = this._matDialog.open(PreviewActivityDialogComponent, {
            panelClass: 'noc-preview-activity-dialog',
            width: '600px',
        });
    }
}
