import * as _ from 'lodash';
const each = require('lodash/forEach');

export class AnnotonNodeClosure {
  term
  closure;
  isaClosure: boolean

  constructor(term, closure) {
    this.term = term;
    this.closure = closure
  }
}