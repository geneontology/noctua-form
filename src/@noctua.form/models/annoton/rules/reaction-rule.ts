import * as _ from 'lodash';
import { Rule } from './rule';

export class ReactionRule extends Rule {
  reaction: any;

  constructor(name?: string, label?: string, description?: string, url?: string) {
    super(name, label, description, url);
  }

}