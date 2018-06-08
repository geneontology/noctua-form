import { Component } from '@angular/core';

import { NoctuaTranslationLoaderService } from '@noctua/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

@Component({
    selector: 'noctua-sample',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss']
})
export class NoctuaWelcomeComponent {
    constructor(private noctuaTranslationLoader: NoctuaTranslationLoaderService) {
        this.noctuaTranslationLoader.loadTranslations(english, turkish);
    }
}
