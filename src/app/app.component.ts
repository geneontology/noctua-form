import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NoctuaSplashScreenService } from '@noctua/services/splash-screen.service';
import { NoctuaTranslationLoaderService } from '@noctua/services/translation-loader.service';


@Component({
    selector: 'noctua-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(
        private translate: TranslateService,
        private noctuaSplashScreen: NoctuaSplashScreenService,
        private noctuaTranslationLoader: NoctuaTranslationLoaderService
    ) {
        this.translate.addLangs(['en', 'tr']);
        this.translate.setDefaultLang('en');
        this.noctuaTranslationLoader.loadTranslations();
        this.translate.use('en');
    }
}
