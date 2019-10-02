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
  }

  ngOnInit() {

  }

}
