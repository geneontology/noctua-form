import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NoctuaSharedModule } from '@noctua/shared.module';

const routes = [{
  path: 'review',
  loadChildren: './review/review.module#ReviewModule'
}, {
  path: 'noctua-form',
  loadChildren: './noctua-form/noctua-form.module#NoctuaFormModule'
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    NoctuaSharedModule
  ]
})

export class PagesModule {
}
