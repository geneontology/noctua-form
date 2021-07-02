import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { ContextMenuModule } from 'ngx-contextmenu';
import { CamsTableComponent } from './cams/cams-table/cams-table.component';
import { NoctuaSearchComponent } from './noctua-search.component';
import { NoctuaSearchBaseModule } from '@noctua.search';
import { NoctuaFooterModule } from 'app/layout/components/footer/footer.module';
import { NoctuaFormModule } from '../noctua-form';
import { CamsReviewComponent } from './cams/cams-review/cams-review.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CamsReviewChangesComponent } from './cams/cams-review-changes/cams-review-changes.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

const routes = [
  {
    path: 's',
    component: NoctuaSearchComponent
  }
];

@NgModule({
  imports: [
    NoctuaSharedModule,
    CommonModule,
    RouterModule.forChild(routes),
    ContextMenuModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NoctuaSearchBaseModule,
    NoctuaFooterModule,
    NoctuaFormModule,
    PerfectScrollbarModule
  ],
  declarations: [
    NoctuaSearchComponent,
    CamsTableComponent,
    CamsReviewComponent,
    CamsReviewChangesComponent
  ]
})

export class NoctuaSearchModule {
}
