import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NoctuaSharedModule } from '@noctua/shared.module';
import { NoctuaSearchBarComponent } from './search-bar.component';
import { NoctuaAdvancedSearchComponent } from './advanced-search/advanced-search.component';

@NgModule({
    declarations: [
        NoctuaSearchBarComponent,
        NoctuaAdvancedSearchComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        NoctuaSharedModule
    ],
    exports: [
        NoctuaSearchBarComponent
    ],
    entryComponents: [
        NoctuaAdvancedSearchComponent
    ]
})
export class NoctuaSearchBarModule {
}
