import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';

import { NoctuaTranslationLoaderService } from '@noctua/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

@Component({
  selector: 'app-sample',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent {
  searchCriteria: any = {};
  searchForm: FormGroup;

  constructor(private noctuaTranslationLoader: NoctuaTranslationLoaderService) {
    this.noctuaTranslationLoader.loadTranslations(english, turkish);
    this.searchForm = this.createAnswerForm();
  }

  createAnswerForm() {
    return new FormGroup({
      goTerm: new FormControl(this.searchCriteria.goTerm),
      geneProduct: new FormControl(this.searchCriteria.geneProduct),
      pmid: new FormControl(this.searchCriteria.pmid),
    });
  }
}
