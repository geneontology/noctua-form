import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NoctuaFormComponent } from './noctua-form.component';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import { NoctuaFormDialogService } from './dialog.service';
import { ContextMenuModule } from 'ngx-contextmenu';

import { CamService } from '@noctua.form/services/cam.service';

import { CamFormComponent } from './cam/cam-form/cam-form.component';
import { CamFormEntityComponent } from './cam/cam-form/cam-entity/cam-entity.component';

import { CamTableComponent } from './cam/cam-table/cam-table.component';
import { CamRowComponent } from './cam/cam-row/cam-row.component';

import { CamRowEditDialogComponent } from './dialogs/cam-row-edit/cam-row-edit.component';
import { AddEvidenceDialogComponent } from './dialogs/add-evidence/add-evidence.component';
import { AnnotonErrorsDialogComponent } from './dialogs/annoton-errors/annoton-errors.component';
import { BeforeSaveDialogComponent } from './dialogs/before-save/before-save.component';
import { CreateFromExistingDialogComponent } from './dialogs/create-from-existing/create-from-existing.component';
import { LinkToExistingDialogComponent } from './dialogs/link-to-existing/link-to-existing.component';
import { SelectEvidenceDialogComponent } from './dialogs/select-evidence/select-evidence.component';
import { SearchDatabaseDialogComponent } from './dialogs/search-database/search-database.component';
import { CamDiagramComponent } from './cam/cam-diagram/cam-diagram.component';
import { NodeComponent } from './cam/cam-diagram/nodes/node/node.component';
import { NodesContainerComponent } from './cam/cam-diagram/nodes/nodes-container.component';

import { CamDiagramService } from './cam/cam-diagram/services/cam-diagram.service';
import { CamTableService } from './cam/cam-table/services/cam-table.service';
import { NodeService } from './cam/cam-diagram/nodes/services/node.service';
import { DiagramMenuComponent } from './cam/cam-diagram/diagram-menu/diagram-menu.component';

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
    ContextMenuModule.forRoot(),
  ],
  providers: [NoctuaFormDialogService, CamService, NodeService, CamDiagramService, CamTableService],
  declarations: [
    NoctuaFormComponent,
    CamFormComponent,
    CamFormEntityComponent,
    CamTableComponent,
    CamRowComponent,
    CamRowEditDialogComponent,
    AddEvidenceDialogComponent,
    AnnotonErrorsDialogComponent,
    BeforeSaveDialogComponent,
    CreateFromExistingDialogComponent,
    LinkToExistingDialogComponent,
    SelectEvidenceDialogComponent,
    SearchDatabaseDialogComponent,
    CamDiagramComponent,
    NodeComponent,
    NodesContainerComponent,
    DiagramMenuComponent
  ],
  entryComponents: [
    NoctuaFormComponent,
    CamRowEditDialogComponent,
    AddEvidenceDialogComponent,
    AnnotonErrorsDialogComponent,
    BeforeSaveDialogComponent,
    CreateFromExistingDialogComponent,
    LinkToExistingDialogComponent,
    SelectEvidenceDialogComponent,
    SearchDatabaseDialogComponent,
    NodeComponent,
    NodesContainerComponent
  ]
})

export class NoctuaFormModule {
}
