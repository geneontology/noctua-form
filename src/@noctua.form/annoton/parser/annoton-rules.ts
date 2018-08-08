import * as _ from 'lodash';
declare const require: any;

const each = require('lodash/forEach');


export class AnnotonRules {
  rules
  errors
  allowedEdges;

  constructor() {
    this.rules = [];
    this.errors = [];
    this.allowedEdges = "";

  }

  populateAllowedEdges() {

  }
}