import _ from 'lodash';
const each = require('lodash/forEach');


export default class AnnotonRules {
  rules
  errors
  allowedEdges;

  constructor() {
    this.saeConstants = {};
    this.rules = [];
    this.errors = [];
    this.allowedEdges = "";

  }

  populateAllowedEdges() {

  }
}