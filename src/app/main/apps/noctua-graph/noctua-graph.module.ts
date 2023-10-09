import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NoctuaSearchBaseModule } from '@noctua.search';
import { NoctuaFooterModule } from 'app/layout/components/footer/footer.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CamGraphComponent } from './cam-graph/cam-graph.component';
import { NoctuaGraphComponent } from './noctua-graph.component';
import { GraphSettingsComponent } from './graph-settings/graph-settings.component';
import { RelationPreviewComponent } from './relation-preview/relation-preview.component';
import { ActivityTableComponent } from './activity-table/activity-table.component';
import { ActivityConnectorTableComponent } from './activity-connector-table/activity-connector-table.component';
import { NoctuaFormModule } from '../noctua-form/noctua-form.module';


const routes = [
  {
    path: 'g',
    component: NoctuaGraphComponent
  }
];

@NgModule({
  imports: [
    NoctuaSharedModule,
    ScrollingModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NoctuaSearchBaseModule,
    NoctuaFooterModule,
    NoctuaFormModule,
  ],
  declarations: [
    NoctuaGraphComponent,
    CamGraphComponent,
    GraphSettingsComponent,
    RelationPreviewComponent,
    ActivityTableComponent,
    ActivityConnectorTableComponent
  ]
})

export class NoctuaGraphModule {
}
