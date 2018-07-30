import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NoctuaFormComponent } from './noctua-form.component';
import { NoctuaSharedModule } from '@noctua/shared.module';

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
  ],
  declarations: [
    NoctuaFormComponent,
  ],
  entryComponents: [NoctuaFormComponent]
})

export class NoctuaFormModule {
}
