import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { NoctuaSharedModule } from '@noctua/shared.module';

import { NoctuaWelcomeComponent } from './welcome.component';

const routes = [
    {
        path: 'sample',
        component: NoctuaWelcomeComponent
    }
];

@NgModule({
    declarations: [
        NoctuaWelcomeComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        TranslateModule,

        NoctuaSharedModule
    ],
    exports: [
        NoctuaWelcomeComponent
    ]
})

export class NoctuaWelcomeModule {
}
