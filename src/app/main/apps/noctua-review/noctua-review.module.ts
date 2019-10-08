import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NoctuaReviewComponent } from './noctua-review.component';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { ContextMenuModule } from 'ngx-contextmenu';
import { NoctuaFormModule } from './../noctua-form/noctua-form.module'

import { CamsTableComponent } from './cams/cams-table/cams-table.component';

// Search and Browse
import { ReviewFilterComponent } from './search/review-filter/review-filter.component';
import { ReviewSearchComponent } from './search/review-search/review-search.component';
import { ReviewContributorsComponent } from './search/review-contributors/review-contributors.component';
import { ReviewGroupsComponent } from './search/review-groups/review-groups.component';
import { ReviewOrganismsComponent } from './search/review-organisms/review-organisms.component';

const routes = [
  {
    path: 'r',
    component: NoctuaReviewComponent
  }
];

@NgModule({
  imports: [
    NoctuaSharedModule,
    CommonModule,
    RouterModule.forChild(routes),
    ContextMenuModule.forRoot(),
    NoctuaFormModule
  ],
  declarations: [
    NoctuaReviewComponent,
    CamsTableComponent,
    ReviewFilterComponent,
    ReviewSearchComponent,
    ReviewContributorsComponent,
    ReviewGroupsComponent,
    ReviewOrganismsComponent
  ],
  exports: [
    ReviewFilterComponent,
    ReviewSearchComponent,
    ReviewContributorsComponent,
    ReviewGroupsComponent,
    ReviewOrganismsComponent
  ]
})

export class NoctuaReviewModule {
}
