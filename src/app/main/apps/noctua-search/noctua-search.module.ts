import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { ContextMenuModule } from 'ngx-contextmenu';
import { NoctuaFormModule } from './../noctua-form/noctua-form.module'

import { CamService } from 'noctua-form-base';
import { CamsTableComponent } from './cams/cams-table/cams-table.component';
import { NoctuaSearchComponent } from './noctua-search.component';
import { NoctuaReviewModule } from '../noctua-review/noctua-review.module';

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
    NoctuaFormModule,
    NoctuaReviewModule
  ],
  declarations: [
    NoctuaSearchComponent,
    CamsTableComponent
  ]
})

export class NoctuaSearchModule {
}
