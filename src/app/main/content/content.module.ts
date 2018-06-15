import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { NoctuaContentComponent } from 'app/main/content/content.component';
import { PagesModule } from './pages/pages.module';

@NgModule({
    declarations: [
        NoctuaContentComponent
    ],
    imports: [
        RouterModule,
        PagesModule,
        NoctuaSharedModule,
    ],
    exports: [
        PagesModule,
        NoctuaContentComponent
    ]
})
export class NoctuaContentModule {
}
