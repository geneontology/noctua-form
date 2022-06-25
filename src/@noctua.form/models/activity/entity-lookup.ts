
declare const require: any;
import { v4 as uuid } from 'uuid';

export class EntityLookup {
  category: string;
  requestParams: any;
  results: any = [];

  constructor(category?: string, requestParams?: any) {
    this.category = category;
    this.requestParams = requestParams;
  }

}
