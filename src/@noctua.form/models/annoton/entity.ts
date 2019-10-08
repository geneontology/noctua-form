import * as _ from 'lodash';
import { EntityLookup } from './entity-lookup';
declare const require: any;
const uuid = require('uuid/v1');

export interface EntityBase {
  id: string;
  label: string;
}

export class Entity implements EntityBase {
  uuid: string;
  id: string;
  label: string;
  url: string;
  classExpression: any;

  constructor(id: string, label: string, url?: string) {
    this.id = id;
    this.label = label;
    this.url = url;
  }

  static createEntity(value: Partial<EntityBase>) {
    const entity = new Entity(value.id, value.label);

    return entity;
  }

  hasValue() {
    const result = this.id !== null && this.id !== undefined && this.id.length > 0;

    return result;
  }
} 
