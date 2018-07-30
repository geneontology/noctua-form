import { NgModule } from '@angular/core';
import { MatDividerModule, MatListModule, MatSlideToggleModule } from '@angular/material';

import { NoctuaSharedModule } from '@noctua/shared.module';

import { QuickPanelComponent } from 'app/layout/components/quick-panel/quick-panel.component';

@NgModule({
    declarations: [
        QuickPanelComponent
    ],
    imports: [
        MatDividerModule,
        MatListModule,
        MatSlideToggleModule,

        NoctuaSharedModule,
    ],
    exports: [
        QuickPanelComponent
    ]
})
export class QuickPanelModule {
}
