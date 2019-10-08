import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NoctuaFormComponent } from './noctua-form.component';
import { NoctuaSharedModule } from './../../../../@noctua/shared.module';
import { NoctuaFormDialogService } from './services/dialog.service';
import { ContextMenuModule } from 'ngx-contextmenu';
import { AnnotonFormComponent } from './cam/annoton/annoton-form/annoton-form.component';
import { AnnotonEntityFormComponent } from './cam/annoton/annoton-entity-form/annoton-entity-form.component';
import { EntityFormComponent } from './cam/annoton/annoton-form/entity-form/entity-form.component';
import { CamTableComponent } from './cam/cam-table/cam-table.component';
import { CamFormComponent } from './cam/cam-form/cam-form.component';
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
import { AnnotonConnectorFormComponent } from './cam/annoton/annoton-connector-form/annoton-connector-form.component';
import { AnnotonEntityTableComponent } from './cam/cam-table/annoton-entity-table/annoton-entity-table.component';
import { AnnotonTableComponent } from './cam/cam-table/annoton-table/annoton-table.component';
import { TripleTableComponent } from './cam/cam-table/triple-table/triple-table.component';
import { EvidenceTableComponent } from './cam/cam-table/triple-table/evidence-table/evidence-table.component';
import { GraphPreviewComponent } from './cam/cam-preview/graph-preview/graph-preview.component';
import { NoctuaConfirmDialogModule } from '@noctua/components';
import { CamPreviewComponent } from './cam/cam-preview/cam-preview.component';
import { CamGraphComponent } from './cam/cam-preview/cam-graph/cam-graph.component';
import { NoctuaEditorModule } from '@noctua.editor/noctua-editor.module';
import { PreviewAnnotonDialogComponent } from './dialogs/preview-annoton/preview-annoton.component';

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
    // NoctuaModule.forRoot(noctuaConfig),
    RouterModule.forChild(routes),
    ContextMenuModule.forRoot(),
    NoctuaConfirmDialogModule,
    NoctuaEditorModule,
  ],
  exports: [
    AnnotonFormComponent,
    AnnotonEntityFormComponent,
    EntityFormComponent,
    CamTableComponent,
    CamRowEditDialogComponent,
    AddEvidenceDialogComponent,
    AnnotonErrorsDialogComponent,
    BeforeSaveDialogComponent,
    CreateFromExistingDialogComponent,
    LinkToExistingDialogComponent,
    SelectEvidenceDialogComponent,
    SearchDatabaseDialogComponent,
    PreviewAnnotonDialogComponent,
    CamDiagramComponent,
    CamFormComponent,
    NodeComponent,
    NodesContainerComponent,
    AnnotonConnectorFormComponent,
    AnnotonEntityTableComponent,
    AnnotonTableComponent,
    TripleTableComponent,
    CamPreviewComponent
  ],
  providers: [
    NoctuaFormDialogService,
    NodeService,
    CamDiagramService,
    CamTableService,
  ],
  declarations: [
    NoctuaFormComponent,
    AnnotonFormComponent,
    AnnotonEntityFormComponent,
    EntityFormComponent,
    CamTableComponent,
    CamRowEditDialogComponent,
    AddEvidenceDialogComponent,
    AnnotonErrorsDialogComponent,
    BeforeSaveDialogComponent,
    PreviewAnnotonDialogComponent,
    CreateFromExistingDialogComponent,
    LinkToExistingDialogComponent,
    SelectEvidenceDialogComponent,
    SearchDatabaseDialogComponent,
    CamDiagramComponent,
    CamFormComponent,
    NodeComponent,
    NodesContainerComponent,
    AnnotonConnectorFormComponent,
    AnnotonEntityTableComponent,
    TripleTableComponent,
    AnnotonTableComponent,
    EvidenceTableComponent,
    GraphPreviewComponent,
    CamPreviewComponent,
    CamGraphComponent,
  ],
  entryComponents: [
    CamRowEditDialogComponent,
    AddEvidenceDialogComponent,
    AnnotonErrorsDialogComponent,
    BeforeSaveDialogComponent,
    CreateFromExistingDialogComponent,
    LinkToExistingDialogComponent,
    SelectEvidenceDialogComponent,
    SearchDatabaseDialogComponent,
    PreviewAnnotonDialogComponent
    //  NodeComponent,
    // NodesContainerComponent
  ]
})

export class NoctuaFormModule {
}
