import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NoctuaSharedModule } from '@noctua/shared.module';
import { SearchOrganismsComponent } from './components/search-organisms/search-organisms.component';
import { SearchGroupsComponent } from './components/search-groups/search-groups.component';
import { SearchContributorsComponent } from './components/search-contributors/search-contributors.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';

@NgModule({
    declarations: [
        SearchFilterComponent,
        SearchFormComponent,
        SearchContributorsComponent,
        SearchGroupsComponent,
        SearchOrganismsComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        NoctuaSharedModule
    ],
    exports: [
        SearchFilterComponent,
        SearchFormComponent,
        SearchContributorsComponent,
        SearchGroupsComponent,
        SearchOrganismsComponent
    ]
})
export class NoctuaSearchBaseModule {
}
