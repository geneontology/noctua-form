import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';

import { NoctuaTranslationLoaderService } from '@noctua/services/translation-loader.service';

import { NoctuaGraphService } from '@noctua.form/services/graph.service'

import { locale as english } from './i18n/en';

import * as _ from 'lodash';


@Component({
  selector: 'app-noctua-form',
  templateUrl: './noctua-form.component.html',
  styleUrls: ['./noctua-form.component.scss']
})
export class NoctuaFormComponent {
  constructor(private noctuaGraphService: NoctuaGraphService) {
    // noctuaGraphService.
  }

}