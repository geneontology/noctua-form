import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');
const map = require('lodash/map');
const uuid = require('uuid/v1');
import { noctuaFormConfig } from './../../noctua-form-config';

import { SaeGraph } from './sae-graph.js';
import { AnnotonError } from "./parser/annoton-error.js";

import { AnnotonNode } from './annoton-node';
import { Evidence } from './evidence';

export class Annoton extends SaeGraph {
  gp;
  _presentation;
  annotonRows;
  nodes;
  annotonType;
  annotonModelType;
  complexAnnotonData;
  errors;
  submitErrors;
  id;
  label;
  edgeOption;
  parser;
  expanded = false;
  private _grid: any[] = [];

  constructor() {
    super();
    this.annotonType = "simple";
    this.annotonModelType = 'default';
    this.complexAnnotonData = {
      mcNode: {},
      gpTemplateNode: {},
      geneProducts: []
    };
    this.errors = [];
    this.submitErrors = [];
    this.id = uuid();
  }

  get annotonConnections() {
    let result = [];
    let edges = this.getEdges('mf')

    if (edges && edges.nodes) {
      result = edges.nodes.map((node) => {
        return node
      })
    }

    return result ? result : []
  }

  get connectionId() {
    let mfNode: AnnotonNode = this.getMFNode();

    return mfNode ? mfNode.modelId : null
  }

  get grid() {
    const self = this;

    if (self._grid.length === 0) {
      this.generateGrid();
    }
    return this._grid;
  }

  getGPNode() {
    const self = this;

    if (self.annotonType === 'simple') {
      return self.getNode('gp');
    } else {
      return self.getNode('mc');
    }
  }

  getMFNode() {
    const self = this;

    if (self.annotonModelType === 'bpOnly') {
      return null;
    } else {
      return self.getNode('mf');
    }
  }

  insertTermNode(annotonModel, id, value) {
    let node = null;

    node = _.find(annotonModel, {
      id: id
    });

    if (node) {
      node.term.control.value = value;
    }
  }

  setAnnotonType(type) {
    this.annotonType = type;
  }

  setAnnotonModelType(type) {
    this.annotonModelType = type;
  }

  addEdgeOptionById(id, edgeOption) {
    const self = this;

    let node = self.getNode(id);
    node.addEdgeOption(edgeOption)
  }

  enableSubmit() {
    const self = this;
    let result = true;
    self.submitErrors = [];

    each(self.nodes, function (node) {
      result = node.enableSubmit(self.submitErrors, self) && result;
    })

    if (self.annotonType === 'simple') {
      let gp = self.getNode('gp');
      gp.term.control.required = false;
      if (!gp.term.control.value.id) {
        gp.term.control.required = true;
        let meta = {
          aspect: self.label
        }
        let error = new AnnotonError('error', 1, "A '" + gp.label + "' is required", meta)
        self.submitErrors.push(error);
        result = false;
      }
    }

    return result;
  }

  copyStructure(srcAnnoton) {
    const self = this;

    self.annotonType = srcAnnoton.annotonType;
    self.annotonModelType = srcAnnoton.annotonModelType;
    self.complexAnnotonData = srcAnnoton.complexAnnotonData;
  }

  copyValues(srcAnnoton) {
    const self = this;

    each(self.nodes, function (destNode) {
      let srcNode = srcAnnoton.getNode(destNode.id);
      if (srcNode) {
        destNode.copyValues(srcNode);
      }
    });
  }

  get presentation() {
    const self = this;

    if (this._presentation) {
      return this._presentation;
    }

    let result = {
      geneProduct: self.getNode('gp'),
      mcNode: self.getNode('mc'),
      gp: {},
      fd: {},
      extra: []
    }

    each(self.nodes, function (node: AnnotonNode) {
      if (node.displaySection && node.displayGroup) {
        if (!result[node.displaySection.id][node.displayGroup.id]) {
          result[node.displaySection.id][node.displayGroup.id] = {
            shorthand: node.displayGroup.shorthand,
            label: node.displayGroup.label,
            nodes: []
          };
        }
        result[node.displaySection.id][node.displayGroup.id].nodes.push(node);
        node.nodeGroup = result[node.displaySection.id][node.displayGroup.id];
        if (node.isComplement) {
          node.nodeGroup.isComplement = true;
        }
      }
    });

    this._presentation = result;

    return this._presentation
  }

  addAnnotonPresentation(displaySectionId) {
    const self = this;
    let result = {};
    result[displaySectionId] = {};

    each(self.nodes, function (node: AnnotonNode) {
      if (node.displaySection === displaySectionId && node.displayGroup) {
        if (!result[displaySectionId][node.displayGroup.id]) {
          result[displaySectionId][node.displayGroup.id] = {
            shorthand: node.displayGroup.shorthand,
            label: node.displayGroup.label,
            nodes: []
          };
        }
        result[displaySectionId][node.displayGroup.id].nodes.push(node);
        node.nodeGroup = result[displaySectionId][node.displayGroup.id];
        if (node.isComplement) {
          node.nodeGroup.isComplement = true;
        }
      }
    });

    this._presentation.extra.push(result);

    return result[displaySectionId];
  }

  generateGrid() {
    const self = this;
    self._grid = [];

    each(self._presentation.fd, function (nodeGroup) {
      each(nodeGroup.nodes, function (node: AnnotonNode) {
        let term = node.getTerm();

        if (node.id !== 'mc' && node.id !== 'gp' && term.id) {
          self.generateGridRow(node);
        }
      });
    });
  }

  generateGridRow(node: AnnotonNode) {
    const self = this;

    let extension = node.treeLevel > 1;
    let term = node.getTerm();

    self._grid.push({
      displayEnabledBy: self.tableCanDisplayEnabledBy(node),
      treeLevel: node.treeLevel,
      gp: self.tableDisplayGp(node),
      relationship: extension ? '' : self.tableDisplayExtension(node),
      relationshipExt: extension ? node.relationship.label : '',
      term: extension ? {} : term,
      extension: extension ? term : {},
      aspect: node.aspect,
      evidence: node.evidence[0].evidence.control.value,
      reference: node.evidence[0].reference.control.link,
      with: node.evidence[0].with.control.value,
      assignedBy: node.evidence[0].assignedBy.control,
      node: node
    })

    for (let i = 1; i < node.evidence.length; i++) {
      self._grid.push({
        treeLevel: node.treeLevel,
        evidence: node.evidence[i].evidence.control.value,
        reference: node.evidence[i].reference.control.link,
        with: node.evidence[i].with.control.value,
        assignedBy: node.evidence[i].assignedBy.control,
        node: node,
      })
    }
  }

  tableDisplayGp(node: AnnotonNode) {
    const self = this;

    let display = false;

    switch (self.annotonModelType) {
      case noctuaFormConfig.annotonModelType.options.default.name:
      case noctuaFormConfig.annotonModelType.options.bpOnly.name:
        display = node.id === 'mf';
        break;
      case noctuaFormConfig.annotonModelType.options.ccOnly.name:
        display = node.id === 'cc';
        break;
    }
    return display ? self.gp : '';
  }

  tableCanDisplayEnabledBy(node: AnnotonNode) {
    const self = this;

    return node.relationship.id === noctuaFormConfig.edge.enabledBy.id
  }

  tableDisplayExtension(node: AnnotonNode) {
    const self = this;

    if (node.id === 'mf') {
      return '';
    } else if (node.isComplement) {
      return 'NOT ' + node.relationship.label;
    } else {
      return node.relationship.label;
    }
  }

  print() {
    let result = []
    this.nodes.forEach((node) => {
      let a = [];

      node.evidence.forEach((evidence: Evidence) => {
        a.push({
          evidence: evidence.getEvidence(),
          reference: evidence.getReference(),
          with: evidence.getWith()
        });
      });

      result.push({
        id: node.id,
        term: node.term.control.value,
        evidence: a
      })
    });

    console.log(result, JSON.stringify(result))
    return result;
  };
}