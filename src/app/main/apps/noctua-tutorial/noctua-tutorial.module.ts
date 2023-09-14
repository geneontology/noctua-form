import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NoctuaSearchBaseModule } from '@noctua.search';
import { NoctuaFooterModule } from 'app/layout/components/footer/footer.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BasicTutorialComponent } from './basic-tutorial/basic-tutorial.component';
import { NoctuaTutorialComponent } from './noctua-tutorial.component';
import { NoctuaFormModule } from '../noctua-form/noctua-form.module';


const routes = [
  {
    path: 'tutorial',
    component: NoctuaTutorialComponent
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
    NoctuaTutorialComponent,
    BasicTutorialComponent
  ]
})

export class NoctuaTutorialModule {
}
