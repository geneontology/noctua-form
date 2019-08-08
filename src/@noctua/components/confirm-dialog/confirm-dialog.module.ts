import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule, MatIconModule } from '@angular/material';
import { NoctuaConfirmDialogComponent } from './confirm-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    declarations: [
        NoctuaConfirmDialogComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        FlexLayoutModule
    ],
    entryComponents: [
        NoctuaConfirmDialogComponent
    ],
})

export class NoctuaConfirmDialogModule {
}
