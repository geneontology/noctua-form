import { NgModule } from '@angular/core';

import { LayoutNoctuaModule } from 'app/layout/layout-noctua/layout-noctua.module';


@NgModule({
    imports: [
        LayoutNoctuaModule
    ],
    exports: [
        LayoutNoctuaModule,
    ]
})
export class LayoutModule {
}
