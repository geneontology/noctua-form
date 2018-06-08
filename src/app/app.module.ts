import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { NoctuaModule } from '@noctua/noctua.module';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { noctuaConfig } from './noctua-config';
import { AppComponent } from './app.component';
import { NoctuaMainModule } from './main/main.module';
import { NoctuaWelcomeModule } from './main/content/welcome/welcome.module';

const appRoutes: Routes = [
    {
        path: '**',
        redirectTo: 'sample'
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
        RouterModule.forRoot(appRoutes),
        TranslateModule.forRoot(),

        // Noctua Main and Shared modules
        NoctuaModule.forRoot(noctuaConfig),
        NoctuaSharedModule,
        NoctuaMainModule,
        NoctuaWelcomeModule
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
