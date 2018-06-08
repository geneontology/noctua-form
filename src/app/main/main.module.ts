import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { NoctuaContentModule } from 'app/main/content/content.module';
import { NoctuaToolbarModule } from 'app/main/toolbar/toolbar.module';
import { NoctuaMainComponent } from './main.component';


@NgModule({
    declarations: [
        NoctuaMainComponent,
    ],
    imports: [
        RouterModule,
        MatSidenavModule,
        NoctuaSharedModule,
        NoctuaContentModule,
        NoctuaToolbarModule,
    ],
    exports: [
        NoctuaMainComponent
    ]
})
export class NoctuaMainModule {
}
