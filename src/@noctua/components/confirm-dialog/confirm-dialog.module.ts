import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule, MatIconModule } from '@angular/material';
import { NoctuaConfirmDialogComponent } from './confirm-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    declarations: [
        NoctuaConfirmDialogComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
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
