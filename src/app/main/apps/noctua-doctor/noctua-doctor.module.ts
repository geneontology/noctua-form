import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { NoctuaSearchBaseModule } from '@noctua.search';
import { NoctuaFooterModule } from 'app/layout/components/footer/footer.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NoctuaDoctorComponent } from './noctua-doctor.component';
import { NoctuaFormModule } from '../noctua-form/noctua-form.module';

const routes = [
  {
    path: 'doctor',
    component: NoctuaDoctorComponent
  }
];

@NgModule({
  imports: [
    NoctuaSharedModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NoctuaSearchBaseModule,
    NoctuaFooterModule,
    NoctuaFormModule,
    PerfectScrollbarModule
  ],
  declarations: [
    NoctuaDoctorComponent
  ]
})

export class NoctuaDoctorModule {
}
