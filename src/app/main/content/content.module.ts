import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { NoctuaContentComponent } from 'app/main/content/content.component';

@NgModule({
    declarations: [
        NoctuaContentComponent
    ],
    imports: [
        RouterModule,

        NoctuaSharedModule,
    ],
    exports: [
        NoctuaContentComponent
    ]
})
export class NoctuaContentModule {
}
