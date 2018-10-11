import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NoctuaTranslationLoaderService } from '@noctua/services/translation-loader.service';

import { locale as english } from './i18n/en';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  searchCriteria: any = {};
  searchForm: FormGroup;

  constructor(private noctuaTranslationLoader: NoctuaTranslationLoaderService,
    private route: ActivatedRoute,
    private router: Router) {
    this.noctuaTranslationLoader.loadTranslations(english);
    this.searchForm = this.createAnswerForm();
  }

  ngOnInit() {

  }

  createAnswerForm() {
    return new FormGroup({
      goTerm: new FormControl(this.searchCriteria.goTerm),
      geneProduct: new FormControl(this.searchCriteria.geneProduct),
      pmid: new FormControl(this.searchCriteria.pmid),
    });
  }
}
