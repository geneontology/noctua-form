import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NoctuaSharedModule } from '@noctua/shared.module';

const routes = [{
  path: 'review',
  loadChildren: './review/review.module#ReviewModule'
}, {
  path: 'form',
  loadChildren: './noctua-form/noctua-form.module#NoctuaFormModule'
}];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    NoctuaSharedModule,
  ],
  providers: [

  ]

})

export class AppsModule {
}
