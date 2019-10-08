import * as _ from 'lodash';
declare const require: any;
const uuid = require('uuid/v1');

import { AnnotonNode } from './annoton-node';
import { Predicate } from './predicate';

export class Triple<T extends AnnotonNode> {

  id
  object: T;
  predicate: Predicate;
  subject: T;

  private _grid: any[] = [];

  constructor(subject: T, predicate: Predicate, object: T) {
    this.id = uuid();
    this.subject = subject;
    this.object = object;
    this.predicate = predicate;
  }

  get grid() {
    const self = this;

    if (self._grid.length === 0) {
      this.generateGrid();
    }
    return this._grid;
  }

  generateGrid() {
    const self = this;

    this._grid = [];
    this._grid.push({
      subject: this.subject.getTerm(),
      relationship: this.predicate,
      object: this.object.getTerm(),
      aspect: '',
      evidence: this.predicate.evidence.length > 0 ? this.predicate[0].evidence : {},
      reference: this.predicate.evidence.length > 0 ? this.predicate[0].reference : '',
      with: this.predicate.evidence.length > 0 ? this.predicate[0].with : '',
      assignedBy: this.predicate.evidence.length > 0 ? this.predicate[0].assignedBy : '',
      subjectNode: this.subject,
      objectNode: this.object,
    });

    for (let i = 1; i < this.predicate.evidence.length; i++) {
      self._grid.push({
        evidence: this.predicate[i].evidence,
        reference: this.predicate[i].reference,
        with: this.predicate[i].with,
        assignedBy: this.predicate[i].assignedBy,
        subjectNode: this.subject,
        objectNode: this.object,
      });
    }
  }

}
