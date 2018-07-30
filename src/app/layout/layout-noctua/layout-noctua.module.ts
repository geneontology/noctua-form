import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NoctuaSharedModule } from '@noctua/shared.module';

import { ContentModule } from 'app/layout/components/content/content.module';
import { NoctuaFooterModule } from 'app/layout/components/footer/footer.module';
import { QuickPanelModule } from 'app/layout/components/quick-panel/quick-panel.module';
import { NoctuaToolbarModule } from 'app/layout/components/toolbar/toolbar.module';

import { LayoutNoctuaComponent } from 'app/layout/layout-noctua/layout-noctua.component';

@NgModule({
    declarations: [
        LayoutNoctuaComponent
    ],
    imports: [
        RouterModule,
        NoctuaSharedModule,
        ContentModule,
        NoctuaFooterModule,
        QuickPanelModule,
        NoctuaToolbarModule
    ],
    exports: [
        LayoutNoctuaComponent
    ]
})
export class LayoutNoctuaModule {
}




