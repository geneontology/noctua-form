import { NgModule } from '@angular/core';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { NoctuaFormModule } from './noctua-form/noctua-form.module';
import { NoctuaGraphModule } from './noctua-graph/noctua-graph.module';
import { NoctuaSearchModule } from './noctua-search/noctua-search.module';
import { NoctuaDoctorModule } from './noctua-doctor/noctua-doctor.module';
import { NoctuaTutorialModule } from './noctua-tutorial/noctua-tutorial.module';
import { NoctuaPathwayModule } from './noctua-pathway/noctua-pathway.module';
import { NoctuaAnnotationsModule } from './noctua-annotations/noctua-annotations.module';

@NgModule({
  imports: [
    NoctuaSharedModule,
    NoctuaFormModule,
    NoctuaSearchModule,
    NoctuaGraphModule,
    NoctuaAnnotationsModule,
    NoctuaDoctorModule,
    NoctuaTutorialModule,
    NoctuaPathwayModule
  ],
  exports: [
    NoctuaFormModule,
    NoctuaFormModule,
    NoctuaSearchModule,
    NoctuaAnnotationsModule,
    NoctuaGraphModule,
    NoctuaDoctorModule,
    NoctuaTutorialModule,
    NoctuaPathwayModule
  ],
  providers: [

  ],
  declarations: []

})

export class AppsModule {
}
