import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NoctuaSharedModule } from '@noctua/shared.module';

import { ContentComponent } from 'app/layout/components/content/content.component';

@NgModule({
    declarations: [
        ContentComponent
    ],
    imports: [
        RouterModule,
        NoctuaSharedModule,
    ],
    exports: [
        ContentComponent
    ]
})
export class ContentModule {
}
