import * as _ from 'lodash';
declare const require: any;
const uuid = require('uuid/v1');

export class EntityLookup {
  category: string;
  requestParams: any;
  results: any = [];

  constructor(category?: string, requestParams?: any) {
    this.category = category;
    this.requestParams = requestParams;
  }

}
