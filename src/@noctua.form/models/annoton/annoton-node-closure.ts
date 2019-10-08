import * as _ from 'lodash';
declare const require: any;

const each = require('lodash/forEach');

export class AnnotonNodeClosure {
  term: string;
  closure: string;
  isaClosure: boolean;

  constructor(term: string, closure: string) {
    this.term = term;
    this.closure = closure;
  }
}