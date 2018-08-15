import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';
import { MatSidenavModule } from '@angular/material';
import { NoctuaModule } from '@noctua/noctua.module';
import { NoctuaProgressBarModule } from '@noctua/components';

import { NoctuaSharedModule } from '@noctua/shared.module';
import { noctuaConfig } from './noctua-config';
import { AppComponent } from './app.component';
import { LayoutModule } from 'app/layout/layout.module';

import { PagesModule } from './main/pages/pages.module';
import { AppsModule } from './main/apps/apps.module';

const appRoutes: Routes = [
    {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        RouterModule.forRoot(appRoutes),
        TranslateModule.forRoot(),

        // Noctua Main and Shared modules
        NoctuaModule.forRoot(noctuaConfig),
        NoctuaSharedModule,
        LayoutModule,
        RouterModule,
        MatSidenavModule,
        NoctuaProgressBarModule,

        //Noctua App
        PagesModule,
        AppsModule
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
