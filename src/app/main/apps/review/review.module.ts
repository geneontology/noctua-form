import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReviewComponent } from './review.component';
import { ReviewListviewComponent } from './listview/review-listview..component';
import { ReviewTreeviewComponent } from './treeview/review-treeview.component';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';

const routes = [
  {
    path: '',
    component: ReviewListviewComponent
  }, {
    path: 'tree',
    component: ReviewTreeviewComponent
  }
];

@NgModule({
  imports: [
    NoctuaSharedModule,
    CommonModule,
    TreeTableModule,
    RouterModule.forChild(routes),
  ],
  providers: [
  ],
  declarations: [
    ReviewComponent,
    ReviewListviewComponent,
    ReviewTreeviewComponent
  ],
  entryComponents: [ReviewComponent]
})

export class ReviewModule {
}
