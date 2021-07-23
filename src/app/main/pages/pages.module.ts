import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { HomeComponent } from './home/home.component';

const routes = [{
  path: 'home', component: HomeComponent
}];

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    NoctuaSharedModule
  ]
})

export class PagesModule {
}
