import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';

import { NoctuaTranslationLoaderService } from '@noctua/services/translation-loader.service';

import { locale as english } from './i18n/en';

import * as _ from 'lodash';
const each = require('lodash/forEach');
import AnnotonError from "@noctua.form//annoton/parser/annoton-error.js";
import Util from "./util/util.js";

@Component({
  selector: 'app-noctua-form',
  templateUrl: './noctua-form.component.html',
  styleUrls: ['./noctua-form.component.scss']
})
export class NoctuaFormComponent {
  constructor() {
  }

}