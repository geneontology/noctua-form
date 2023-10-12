import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TreeModule } from '@circlon/angular-tree-component';
import { NoctuaSharedModule } from './../../../../@noctua/shared.module';
import { NoctuaAnnotationsDialogService } from './services/dialog.service';
import { NoctuaConfirmDialogModule } from '@noctua/components';
import { NoctuaEditorModule } from '@noctua.editor/noctua-editor.module';
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
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NoctuaAnnotationsComponent } from './noctua-annotations.component';
import { NoctuaSearchBaseModule } from '@noctua.search';
import { NoctuaFormModule } from '../noctua-form/noctua-form.module';
import { AnnotationFormComponent } from './forms/annotation-form/annotation-form.component';
import { AnnotationEntityFormComponent } from './forms/annotation-form/entity-form/entity-form.component';
import { AnnotationEvidenceFormComponent } from './forms/annotation-form/evidence-form/evidence-form.component';

const routes = [
  {
    path: '',
    component: NoctuaAnnotationsComponent
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
    NoctuaFormModule,
  ],
  exports: [
    NoctuaAnnotationsComponent
  ],
  providers: [
    NoctuaAnnotationsDialogService,
  ],
  declarations: [
    NoctuaAnnotationsComponent,
    AnnotationEntityFormComponent,
    AnnotationEvidenceFormComponent,
    AnnotationFormComponent
  ],
})

export class NoctuaAnnotationsModule {
}
