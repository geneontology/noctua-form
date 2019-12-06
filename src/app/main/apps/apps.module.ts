import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { NoctuaFormModule } from './noctua-form/noctua-form.module';
import { NoctuaReviewModule } from './noctua-review/noctua-review.module';
import { NoctuaSearchModule } from './noctua-search/noctua-search.module';


@NgModule({
  declarations: [],
  imports: [
    TranslateModule,
    NoctuaSharedModule,
    NoctuaFormModule,
    NoctuaReviewModule,
    NoctuaSearchModule
  ],
  exports: [
    NoctuaFormModule,
    NoctuaFormModule,
    NoctuaReviewModule,
    NoctuaSearchModule
  ],
  providers: [

  ]

})

export class AppsModule {
}
