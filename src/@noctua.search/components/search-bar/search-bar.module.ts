import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NoctuaSharedModule } from '@noctua/shared.module';
import { NoctuaSearchBarComponent } from './search-bar.component';

@NgModule({
    declarations: [
        NoctuaSearchBarComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        NoctuaSharedModule
    ],
    exports: [
        NoctuaSearchBarComponent
    ]
})
export class NoctuaSearchBarModule {
}
