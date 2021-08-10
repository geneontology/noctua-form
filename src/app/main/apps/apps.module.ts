import { NgModule } from '@angular/core';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { NoctuaFormModule } from './noctua-form/noctua-form.module';
import { NoctuaGraphModule } from './noctua-graph/noctua-graph.module';
import { NoctuaSearchModule } from './noctua-search/noctua-search.module';
import { NoctuaDoctorModule } from './noctua-doctor/noctua-doctor.module';

@NgModule({
  declarations: [],
  imports: [
    NoctuaSharedModule,
    NoctuaFormModule,
    NoctuaSearchModule,
    NoctuaGraphModule,
    NoctuaDoctorModule
  ],
  exports: [
    NoctuaFormModule,
    NoctuaFormModule,
    NoctuaSearchModule,
    NoctuaGraphModule,
    NoctuaDoctorModule
  ],
  providers: [

  ]

})

export class AppsModule {
}
