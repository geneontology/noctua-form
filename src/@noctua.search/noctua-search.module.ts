import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NoctuaSharedModule } from '@noctua/shared.module';
import { NoctuaSearchBarComponent } from './components/search-bar/search-bar.component';
import { NoctuaAdvancedSearchComponent } from './components/search-bar/advanced-search/advanced-search.component';

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
