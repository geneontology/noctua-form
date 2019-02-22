import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReviewComponent } from './review.component';
import { ReviewListviewComponent } from './listview/review-listview..component';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { ReviewDialogService } from './dialog.service';
import { NoctuaDataService } from '@noctua.common/services/noctua-data.service';

import { ReviewSearchComponent } from './sidenavs/review-search/review-search.component';
import { ReviewCuratorsComponent } from './sidenavs/review-curators/review-curators.component';
import { ReviewSpeciesComponent } from './sidenavs/review-species/review-species.component';

import { CamTableComponent } from './listview/cam-table/cam-table.component';
import { CamRowComponent } from './details/cam-row/cam-row.component';

import { CamRowEditDialogComponent } from './dialogs/cam-row-edit/cam-row-edit.component';
import { CamEditSummaryDialogComponent } from './dialogs/cam-edit-summary/cam-edit-summary-dialog.component';

const routes = [
  {
    path: '',
    component: ReviewListviewComponent
  }
];

@NgModule({
  imports: [
    NoctuaSharedModule,
    CommonModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    ReviewDialogService,
    NoctuaDataService

  ],
  declarations: [
    ReviewComponent,
    ReviewSearchComponent,
    ReviewCuratorsComponent,
    ReviewSpeciesComponent,
    CamTableComponent,
    CamRowComponent,
    CamRowEditDialogComponent,
    CamEditSummaryDialogComponent,
    ReviewListviewComponent
  ],
  entryComponents: [ReviewComponent, CamEditSummaryDialogComponent, CamRowEditDialogComponent]
})

export class ReviewModule {
}
