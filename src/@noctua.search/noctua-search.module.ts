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
import { SearchRelationComponent } from './components/search-relation/search-relation.component';
import { SearchHistoryComponent } from './components/search-history/search-history.component';
import { NoctuaEditorModule } from '@noctua.editor';
import { ArtBasketComponent } from './components/art-basket/art-basket.component';
import { ReviewFormComponent } from './components/review-form/review-form.component';
import { CamsReviewChangesDialogComponent } from './components/dialogs/cams-review-changes/cams-review-changes.component';
import { CamsUnsavedDialogComponent } from './components/dialogs/cams-unsaved/cams-unsaved.component';

@NgModule({
    declarations: [
        SearchFilterComponent,
        SearchFormComponent,
        SearchContributorsComponent,
        SearchGroupsComponent,
        SearchOrganismsComponent,
        SearchRelationComponent,
        SearchHistoryComponent,
        ArtBasketComponent,
        ReviewFormComponent,
        CamsReviewChangesDialogComponent,
        CamsUnsavedDialogComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        NoctuaSharedModule,
        NoctuaEditorModule
    ],
    exports: [
        SearchFilterComponent,
        SearchFormComponent,
        SearchContributorsComponent,
        SearchGroupsComponent,
        SearchOrganismsComponent,
        SearchRelationComponent,
        SearchHistoryComponent,
        ArtBasketComponent,
        ReviewFormComponent,
        CamsReviewChangesDialogComponent,
        CamsUnsavedDialogComponent,
    ]
})
export class NoctuaSearchBaseModule {
}
