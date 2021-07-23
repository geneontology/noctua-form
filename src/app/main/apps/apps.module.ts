import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { NoctuaFormModule } from './noctua-form/noctua-form.module';


@NgModule({
  declarations: [],
  imports: [
    NoctuaSharedModule,
    NoctuaFormModule,
  ],
  exports: [
    NoctuaFormModule,
    NoctuaFormModule,
  ],
  providers: [

  ]

})

export class AppsModule {
}
