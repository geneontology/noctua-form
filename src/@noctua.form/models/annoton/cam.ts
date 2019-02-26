import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');
const uuid = require('uuid/v1');
import { SaeGraph } from './sae-graph.js';
import { AnnotonError } from "./parser/annoton-error.js";

import { Annoton } from './annoton'

export class Cam {
  id: string;
  expanded?: boolean;
  model?: {};
  annotatedEntity?: {};
  camRow?: any;
  _annotons: Annoton[] = [];

  error = false;
  engine;
  onGraphChanged;
  manager;
  graph;
  modelId;
  modelTitle;
  modelState;

  constructor() {
  }

  get annotons() {
    return this._annotons;
  }

  set annotons(annoton) {
    this._annotons = annoton;
  }

  getAnnotonByConnectionId(connectionId) {
    const self = this;
    let result = _.find(self._annotons, (annoton: Annoton) => {
      return annoton.connectionId === connectionId;
    })

    return result;
  }

  getMFNodes() {
    const self = this;
    let result = [];

    each(self._annotons, function (annotonData) {
      each(annotonData.annoton.nodes, function (node) {
        if (node.id === 'mf') {
          result.push({
            node: node,
            annoton: annotonData.annoton
          })
        }
      });
    });

    return result;
  }

  getUniqueEvidences(result) {
    const self = this;

    if (!result) {
      result = [];
    }

    function find(data, evidence) {
      return _.find(data, function (x) {
        // console.log(x.isEvidenceEqual(evidence))
        return x.isEvidenceEqual(evidence)
      })
    }

    each(self._annotons, function (annotonData) {
      each(annotonData.annoton.nodes, function (node) {
        each(node.evidence, function (evidence) {
          if (evidence.hasValue()) {
            if (!self.evidenceExists(result, evidence)) {
              result.push(evidence);
            }
          }
        });
      });
    });

    return result;
  }

  evidenceExists(data, evidence) {
    const self = this;

    return _.find(data, function (x) {
      return x.isEvidenceEqual(evidence)
    })
  }

  addUniqueEvidences(existingEvidence, data) {
    const self = this;
    let result = [];

    each(data, function (annotation) {
      each(annotation.annotations, function (node) {
        each(node.evidence, function (evidence) {
          if (evidence.hasValue()) {
            if (!self.evidenceExists(result, evidence)) {
              result.push(evidence);
            }
          }
        });
      });
    });

    return result;
  }

  addUniqueEvidencesFromAnnoton(annoton) {
    const self = this;
    let result = [];

    each(annoton.nodes, function (node) {
      each(node.evidence, function (evidence) {
        if (evidence.hasValue()) {
          if (!self.evidenceExists(result, evidence)) {
            result.push(evidence);
          }
        }
      });
    });

    return result;
  }
}