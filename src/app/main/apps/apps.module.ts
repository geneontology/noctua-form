import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { NoctuaFormModule } from './noctua-form/noctua-form.module';
import { NoctuaGraphModule } from './noctua-graph/noctua-graph.module';
import { NoctuaSearchModule } from './noctua-search/noctua-search.module';
import { TreeModule } from '@circlon/angular-tree-component';

@NgModule({
  declarations: [],
  imports: [
    NoctuaSharedModule,
    NoctuaFormModule,
    NoctuaSearchModule,
    NoctuaGraphModule
  ],
  exports: [
    NoctuaFormModule,
    NoctuaFormModule,
    NoctuaSearchModule,
    NoctuaGraphModule
  ],
  providers: [

  ]

})

export class AppsModule {
}
