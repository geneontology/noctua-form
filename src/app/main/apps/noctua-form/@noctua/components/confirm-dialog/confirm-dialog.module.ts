import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { NoctuaConfirmDialogComponent } from './confirm-dialog.component';

@NgModule({
    declarations: [
        NoctuaConfirmDialogComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule
    ],
    entryComponents: [
        NoctuaConfirmDialogComponent
    ],
})

export class NoctuaConfirmDialogModule {
}
