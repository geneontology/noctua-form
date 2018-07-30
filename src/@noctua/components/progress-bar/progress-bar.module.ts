import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatButtonModule, MatIconModule, MatProgressBarModule } from '@angular/material';

import { NoctuaProgressBarComponent } from './progress-bar.component';

@NgModule({
    declarations: [
        NoctuaProgressBarComponent
    ],
    imports: [
        CommonModule,
        RouterModule,

        MatButtonModule,
        MatIconModule,
        MatProgressBarModule
    ],
    exports: [
        NoctuaProgressBarComponent
    ]
})
export class NoctuaProgressBarModule {
}
