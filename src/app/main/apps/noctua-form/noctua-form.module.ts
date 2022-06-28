import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TreeModule } from '@circlon/angular-tree-component';
import { NoctuaFormComponent } from './noctua-form.component';
import { NoctuaSharedModule } from './../../../../@noctua/shared.module';
import { NoctuaFormDialogService } from './services/dialog.service';
import { ActivityFormComponent } from './cam/activity/activity-form/activity-form.component';
import { EntityFormComponent } from './cam/activity/activity-form/entity-form/entity-form.component';
import { CamTableComponent } from './cam/cam-table/cam-table.component';
import { CamFormComponent } from './cam/cam-form/cam-form.component';
import { AddEvidenceDialogComponent } from './dialogs/add-evidence/add-evidence.component';
import { ActivityErrorsDialogComponent } from './dialogs/activity-errors/activity-errors.component';
import { BeforeSaveDialogComponent } from './dialogs/before-save/before-save.component';
import { CreateFromExistingDialogComponent } from './dialogs/create-from-existing/create-from-existing.component';
import { LinkToExistingDialogComponent } from './dialogs/link-to-existing/link-to-existing.component';
import { SelectEvidenceDialogComponent } from './dialogs/select-evidence/select-evidence.component';
import { SearchDatabaseDialogComponent } from './dialogs/search-database/search-database.component';
import { ActivityConnectorFormComponent } from './cam/activity/activity-connector-form/activity-connector-form.component';
import { ActivityTableComponent } from './cam/cam-table/activity-table/activity-table.component';
import { TripleTableComponent } from './cam/cam-table/triple-table/triple-table.component';
import { GraphPreviewComponent } from './cam/cam-preview/graph-preview/graph-preview.component';
import { NoctuaConfirmDialogModule } from '@noctua/components';
import { CamPreviewComponent } from './cam/cam-preview/cam-preview.component';
import { CamGraphComponent } from './cam/cam-preview/cam-graph/cam-graph.component';
import { NoctuaEditorModule } from '@noctua.editor/noctua-editor.module';
import { PreviewActivityDialogComponent } from './dialogs/preview-activity/preview-activity.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { SearchEvidenceDialogComponent } from './dialogs/search-evidence/search-evidence.component';
import { SelectEvidenceComponent } from './components/select-evidence/select-evidence.component';
import { MatTreeModule } from '@angular/material/tree';
import { CamErrorsDialogComponent } from './dialogs/cam-errors/cam-errors.component';
import { EvidenceTableComponent } from './cam/cam-table/activity-table/evidence-table/evidence-table.component';
import { ActivityTreeComponent } from './cam/cam-table/activity-tree/activity-tree.component';
import { ActivityTreeNodeComponent } from './cam/cam-table/activity-tree/activity-tree-node/activity-tree-node.component';
import { CreateActivityDialogComponent } from './dialogs/create-activity/create-activity.component';
import { ActivityTreeTableComponent } from './cam/cam-table/activity-tree-table/activity-tree-table.component';
import { PreviewActivityComponent } from './cam/activity/preview-activity/preview-activity.component';
import { NoctuaSearchBaseModule } from '@noctua.search';
import { CopyModelComponent } from './cam/copy-model/copy-model.component';
import { ResizableModule } from 'angular-resizable-element';
import { NoctuaTermDetailComponent } from './components/term-detail/term-detail.component';
import { CamStatsComponent } from './components/cam-stats/cam-stats.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GeneralStatsComponent } from './components/cam-stats/general-stats/general-stats.component';
import { AspectStatsComponent } from './components/cam-stats/aspect-stats/aspect-stats.component';
import { ContributionStatsComponent } from './components/cam-stats/contribution-stats/contribution-stats.component';
import { StatementStatsComponent } from './components/cam-stats/statement-stats/statement-stats.component';
import { GPStatsComponent } from './components/cam-stats/gp-stats/gp-stats.component';
import { ActivityFormTableNodeComponent } from './cam/cam-table/activity-form-table/activity-form-table-node/activity-form-table-node.component';
import { ActivityFormTableComponent } from './cam/cam-table/activity-form-table/activity-form-table.component';
import { EvidenceFormTableComponent } from './cam/cam-table/activity-form-table/evidence-table/evidence-table.component';
import { ConfirmCopyModelDialogComponent } from './dialogs/confirm-copy-model/confirm-copy-model.component';

const routes = [
  {
    path: '',
    component: NoctuaFormComponent
  }
];

@NgModule({
  imports: [
    NoctuaSharedModule,
    TreeModule,
    CommonModule,
    // NoctuaModule.forRoot(noctuaConfig),
    RouterModule.forChild(routes),
    NoctuaConfirmDialogModule,
    NoctuaEditorModule,
    NoctuaSearchBaseModule,
    NgxChartsModule,

    //Material
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTableModule,
    MatTooltipModule,
    MatTreeModule,
    ResizableModule,
  ],
  exports: [
    ActivityFormComponent,
    EntityFormComponent,
    CamTableComponent,
    AddEvidenceDialogComponent,
    CreateActivityDialogComponent,
    ActivityErrorsDialogComponent,
    CamErrorsDialogComponent,
    BeforeSaveDialogComponent,
    CreateFromExistingDialogComponent,
    LinkToExistingDialogComponent,
    SelectEvidenceDialogComponent,
    SearchDatabaseDialogComponent,
    SearchEvidenceDialogComponent,
    PreviewActivityDialogComponent,
    CamFormComponent,
    CopyModelComponent,
    ActivityConnectorFormComponent,
    ActivityTableComponent,
    ActivityTreeComponent,
    ActivityTreeTableComponent,
    TripleTableComponent,
    ActivityTreeNodeComponent,
    ActivityFormTableComponent,
    ActivityFormTableNodeComponent,
    CamPreviewComponent,
    PreviewActivityComponent,
    GraphPreviewComponent,
    EvidenceFormTableComponent,
    ConfirmCopyModelDialogComponent
  ],
  providers: [
    NoctuaFormDialogService,
  ],
  declarations: [
    NoctuaFormComponent,
    ActivityFormComponent,
    EntityFormComponent,
    CamTableComponent,
    AddEvidenceDialogComponent,
    CreateActivityDialogComponent,
    ActivityErrorsDialogComponent,
    CamErrorsDialogComponent,
    BeforeSaveDialogComponent,
    PreviewActivityDialogComponent,
    CreateFromExistingDialogComponent,
    LinkToExistingDialogComponent,
    SelectEvidenceDialogComponent,
    SearchDatabaseDialogComponent,
    SearchEvidenceDialogComponent,
    CamFormComponent,
    CopyModelComponent,
    ActivityConnectorFormComponent,
    TripleTableComponent,
    ActivityTableComponent,
    ActivityTreeTableComponent,
    EvidenceTableComponent,
    GraphPreviewComponent,
    CamPreviewComponent,
    CamGraphComponent,
    ActivityTreeComponent,
    ActivityTreeNodeComponent,
    ActivityFormTableComponent,
    ActivityFormTableNodeComponent,
    SelectEvidenceComponent,
    PreviewActivityComponent,
    NoctuaTermDetailComponent,
    CamStatsComponent,
    GPStatsComponent,
    AspectStatsComponent,
    GeneralStatsComponent,
    ContributionStatsComponent,
    StatementStatsComponent,
    EvidenceFormTableComponent,
    ConfirmCopyModelDialogComponent
  ],
})

export class NoctuaFormModule {
}
