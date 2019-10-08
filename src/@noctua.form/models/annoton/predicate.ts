import { Entity } from './entity';
import { Evidence } from './evidence';
import { each, find, cloneDeep } from 'lodash';
import { EntityLookup } from './entity-lookup';
declare const require: any;
const uuid = require('uuid/v1');

export class Predicate {
  uuid: string;
  edge: Entity;
  evidence: Evidence[];
  evidenceLookup: EntityLookup = new EntityLookup();

  _evidenceMeta = {
    lookupBase: '',
    ontologyClass: 'eco'
  };

  constructor(edge: Entity, evidence?: Evidence[]) {
    this.edge = edge;
    this.evidence = evidence ? evidence : [];
  }

  setEvidenceMeta(ontologyClass, lookupBase) {
    this._evidenceMeta.lookupBase = lookupBase;
    this._evidenceMeta.ontologyClass = ontologyClass;
    this.evidenceLookup.requestParams = JSON.parse(JSON.stringify(lookupBase));
    this.addEvidence();
  }

  setEvidence(evidences: Evidence[], except?) {
    const self = this;
    self.evidence = [];

    each(evidences, function (srcEvidence, i) {
      self.addEvidence(srcEvidence);
      //destEvidence.copyValues(srcEvidence, except);
    });
  }

  addEvidence(srcEvidence?: Evidence) {
    const self = this;
    const evidence = srcEvidence ? cloneDeep(srcEvidence) : new Evidence();

    evidence.setEvidenceOntologyClass(self._evidenceMeta.ontologyClass);
    self.evidence.push(evidence);
    return evidence;
  }

  removeEvidence(index) {
    const self = this;

    if (index === 0 && self.evidence.length === 1) {
      self.evidence[0].clearValues();
    } else {
      self.evidence.splice(index, 1);
    }
  }

  resetEvidence() {
    const self = this;

    self.evidence = [self.evidence[0]];
    self.evidence[0].clearValues();
  }

  getEvidenceById(id) {
    const self = this;

    return find(self.evidence, (evidence: Evidence) => {
      return evidence.uuid === id;
    });
  }
}