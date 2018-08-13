import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NoctuaFormComponent } from './noctua-form.component';
import { NoctuaSharedModule } from '@noctua/shared.module';

import { NoctuaGraphService } from '@noctua.form/services/graph.service'

const routes = [{
  path: '',
  component: NoctuaFormComponent
}];

@NgModule({
  imports: [
    NoctuaSharedModule,
    CommonModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    NoctuaGraphService
  ],
  declarations: [
    NoctuaFormComponent,
  ],
  entryComponents: [NoctuaFormComponent]
})

export class NoctuaFormModule {
}
