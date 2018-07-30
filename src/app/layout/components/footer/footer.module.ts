import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NoctuaSharedModule } from '@noctua/shared.module';

import { NoctuaFooterComponent } from 'app/layout/components/footer/footer.component';

@NgModule({
    declarations: [
        NoctuaFooterComponent
    ],
    imports: [
        RouterModule,
        NoctuaSharedModule
    ],
    exports: [
        NoctuaFooterComponent
    ]
})
export class NoctuaFooterModule {
}
