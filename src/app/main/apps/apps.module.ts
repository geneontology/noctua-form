import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { NoctuaFormModule } from './noctua-form/noctua-form.module';


@NgModule({
  declarations: [],
  imports: [
    TranslateModule,
    NoctuaSharedModule,
    NoctuaFormModule,
  ],
  exports: [
    NoctuaFormModule,
    NoctuaFormModule,
  ],
  providers: []
})

export class AppsModule {
}
