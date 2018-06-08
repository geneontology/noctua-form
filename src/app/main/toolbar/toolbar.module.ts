import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatMenuModule, MatProgressBarModule, MatToolbarModule } from '@angular/material';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { NoctuaToolbarComponent } from 'app/main/toolbar/toolbar.component';

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
    ],
    exports: [
        NoctuaToolbarComponent
    ]
})

export class NoctuaToolbarModule {
}
