import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NoctuaFormComponent } from './noctua-form.component';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import { NoctuaFormDialogService } from './dialog.service';

import { CamFormComponent } from './cam/cam-form/cam-form.component';
import { CamFormEntityComponent } from './cam/cam-form/cam-entity/cam-entity.component';

import { CamTableComponent } from './cam/cam-table/cam-table.component';
import { CamRowComponent } from './cam/cam-row/cam-row.component';

import { CamRowEditDialogComponent } from './dialogs/cam-row-edit/cam-row-edit.component';


const routes = [
  {
    path: '',
    component: NoctuaFormComponent
  }
];

@NgModule({
  imports: [
    NoctuaSharedModule,
    CommonModule,
    TreeTableModule,
    RouterModule.forChild(routes),
  ],
  providers: [NoctuaFormDialogService],
  declarations: [
    NoctuaFormComponent,
    CamFormComponent,
    CamFormEntityComponent,
    CamTableComponent,
    CamRowComponent,
    CamRowEditDialogComponent,
  ],
  entryComponents: [NoctuaFormComponent, CamRowEditDialogComponent]
})

export class NoctuaFormModule {
}
