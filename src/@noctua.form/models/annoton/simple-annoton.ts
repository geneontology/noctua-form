import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');
const map = require('lodash/map');
const uuid = require('uuid/v1');
import { noctuaFormConfig } from './../../noctua-form-config';

import { SaeGraph } from './sae-graph';
import { AnnotonError } from "./parser/annoton-error";

import { AnnotonNode } from './annoton-node';
import { Evidence } from './evidence';

export class SimpleAnnoton extends SaeGraph<AnnotonNode> {
  gp;
  _presentation;
  errors;
  submitErrors;
  id;
  label;
  edgeOption;
  parser;
  expanded = false;
  visible = true;

  private _grid: any[] = [];

  constructor() {
    super();
    this.errors = [];
    this.submitErrors = [];
    this.id = uuid();
  }



}