import { NoctuaFormConfig } from './noctua-form-config';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { NoctuaTranslationLoaderService } from '@noctua/services/translation-loader.service';
import { locale as english } from './i18n/en';

@Component({
  selector: 'app-noctua-form',
  templateUrl: './noctua-form.component.html',
  styleUrls: ['./noctua-form.component.scss']
})

export class NoctuaFormComponent {
  searchCriteria: any = {};
  searchForm: FormGroup;
  noctuaFormConfig: any = NoctuaFormConfig;

  constructor(private noctuaTranslationLoader: NoctuaTranslationLoaderService) {
    this.noctuaTranslationLoader.loadTranslations(english);
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