import { Component } from '@angular/core';

import { NoctuaTranslationLoaderService } from '@noctua/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

@Component({
  selector: 'app-sample',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent {
  constructor(private noctuaTranslationLoader: NoctuaTranslationLoaderService) {
    this.noctuaTranslationLoader.loadTranslations(english, turkish);

  }
}
