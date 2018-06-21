import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { NoctuaSharedModule } from '@noctua/shared.module';

const routes = [
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  imports: [
    NoctuaSharedModule,
    CommonModule,
    RouterModule.forChild(routes),
  ],
  providers: [
  ],
  declarations: [
    HomeComponent,
  ],
  entryComponents: [HomeComponent]
})

export class HomeModule {
}
