import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface Locale {
    lang: string;
    data: Object;
}

@Injectable()
export class NoctuaTranslationLoaderService {
    constructor(private translate: TranslateService) {
    }

    public loadTranslations(...args: Locale[]): void {
        const locales = [...args];

        locales.forEach((locale) => {
            this.translate.setTranslation(locale.lang, locale.data, true);
        });
    }
}
