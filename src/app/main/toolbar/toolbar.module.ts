import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatMenuModule, MatProgressBarModule, MatToolbarModule } from '@angular/material';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { NoctuaToolbarComponent } from 'app/main/toolbar/toolbar.component';
import { NoctuaSearchBarModule } from '@noctua.search/components';

@NgModule({
    declarations: [
        NoctuaToolbarComponent
    ],
    imports: [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatToolbarModule,
        NoctuaSharedModule,
        NoctuaSearchBarModule
    ],
    exports: [
        NoctuaToolbarComponent
    ]
})

export class NoctuaToolbarModule {
}
