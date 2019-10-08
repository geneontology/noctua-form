import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');
const map = require('lodash/map');
const uuid = require('uuid/v1');
import { Edge as NgxEdge, Node as NgxNode, NodeDimension, ClusterNode, Layout } from '@swimlane/ngx-graph';
import { noctuaFormConfig } from './../../noctua-form-config';

import { SaeGraph } from './sae-graph';
import { AnnotonError } from "./parser/annoton-error";

import { AnnotonNode, AnnotonNodeType } from './annoton-node';
import { Evidence } from './evidence';
import { Triple } from './triple';
import { Entity } from './entity';
import { getEdges, Edge, getNodes, subtractNodes } from './noctua-form-graph';
import { AnnotonParser } from './parser';

import * as InsertEntityDefinition from './../../data/config/insert-entity-definition';
import { Predicate } from './predicate';
export enum AnnotonState {
  creation = 1,
  editing
}

export enum AnnotonType {
  default = 'default',
  bpOnly = 'bpOnly',
  ccOnly = 'ccOnly'
}

export class Annoton extends SaeGraph<AnnotonNode> {
  gp;
  id: string;
  label: string;
  parser: AnnotonParser;
  annotonRows;
  annotonType;
  errors;
  submitErrors;
  expanded = false;
  visible = true;
  graphPreview = {
    nodes: [],
    edges: []
  };
  private _presentation: any;
  private _grid: any[] = [];

  constructor() {
    super();
    this.annotonType = 'default';
    this.id = uuid();
    this.errors = [];
    this.submitErrors = [];
  }

  get annotonConnections() {
    throw new Error('Method not implemented');
  }

  get rootNodeType(): AnnotonNodeType {
    return this.annotonType === AnnotonType.ccOnly ?
      AnnotonNodeType.GoMolecularEntity :
      AnnotonNodeType.GoMolecularFunction;
  }

  get rootNode(): AnnotonNode {
    return this.getNode(this.rootNodeType);
  }

  updateEntityInsertMenu() {
    const self = this;

    each(self.nodes, (node: AnnotonNode) => {
      const canInsertNodes = InsertEntityDefinition.canInsertEntity[node.type] || [];
      const exist = [];

      each(canInsertNodes, (nodeDescription: InsertEntityDefinition.InsertNodeDescription) => {
        if (nodeDescription.cardinality === InsertEntityDefinition.CardinalityType.oneToOne) {
          const edgeTypeExist = self.edgeTypeExist(node.id, nodeDescription.predicate.id, node.type, nodeDescription.node.type);

          if (edgeTypeExist) {
            exist.push(edgeTypeExist.object.type);
          }
        }
      });

      node.canInsertNodes = canInsertNodes.filter((nodeDescription: InsertEntityDefinition.InsertNodeDescription) => {
        return !exist.includes(nodeDescription.node.type);
      });
    });

    // remove the subject menu
    each(self.edges, function (triple: Triple<AnnotonNode>) {
      if (triple.subject.type === triple.object.type) {
        triple.subject.canInsertNodes = [];
      }
    });
  }

  updateEdges(subjectNode: AnnotonNode, insertNode: AnnotonNode, predicate: Predicate) {
    const self = this;
    const canInsertSubjectNodes = InsertEntityDefinition.canInsertEntity[subjectNode.type] || [];
    let updated = false;

    each(canInsertSubjectNodes, (nodeDescription: InsertEntityDefinition.InsertNodeDescription) => {
      if (nodeDescription.cardinality === InsertEntityDefinition.CardinalityType.oneToOne) {
        const edgeTypeExist = self.edgeTypeExist(subjectNode.id, nodeDescription.predicate.id, subjectNode.type, nodeDescription.node.type);

        if (edgeTypeExist) {
          self.removeEdge(edgeTypeExist.subject, edgeTypeExist.object, edgeTypeExist.predicate);
          self.addEdge(edgeTypeExist.subject, insertNode, edgeTypeExist.predicate);
          self.addEdge(insertNode, edgeTypeExist.object, predicate);
          updated = true;

          return false;
        }
      }
    });

    if (!updated) {
      self.addEdgeById(subjectNode.id, insertNode.id, predicate);
    }

  }

  getGPNode() {
    const self = this;

    return self.getNode(AnnotonNodeType.GoMolecularEntity);
  }

  getMFNode() {
    const self = this;

    return self.getNode(AnnotonNodeType.GoMolecularFunction);
  }

  adjustAnnoton() {
    const self = this;

    switch (self.annotonType) {
      case noctuaFormConfig.annotonType.options.bpOnly.name:
        const rootMF = noctuaFormConfig.rootNode.mf;
        const mfNode = self.getMFNode();
        const bpNode = self.getNode(AnnotonNodeType.GoBiologicalProcess);

        mfNode.term = new Entity(rootMF.id, rootMF.label);
        break;
    }
  }

  copyValues(srcAnnoton) {
    const self = this;

    each(self.nodes, function (destNode: AnnotonNode) {
      const srcNode = srcAnnoton.getNode(destNode.id);
      if (srcNode) {
        destNode.copyValues(srcNode);
      }
    });
  }

  setAnnotonType(type) {
    this.annotonType = type;
  }

  get grid() {
    const self = this;

    if (self._grid.length === 0) {
      this.generateGrid();
    }
    return this._grid;
  }

  enableSubmit() {
    const self = this;
    let result = true;

    self.submitErrors = [];

    each(self.nodes, (node: AnnotonNode) => {
      result = node.enableSubmit(self.submitErrors) && result;
    });

    return result;
  }

  createSave() {
    const self = this;
    const saveData = {
      title: 'enabled by ' + self.getNode(AnnotonNodeType.GoMolecularEntity).term.label,
      triples: [],
      nodes: [],
      graph: null
    };

    self.adjustAnnoton();

    const graph = self.getTrimmedGraph(this.rootNodeType);
    const keyNodes = getNodes(graph);
    const edges: Edge<Triple<AnnotonNode>>[] = getEdges(graph);

    saveData.nodes = Object.values(keyNodes);

    saveData.triples = edges.map((edge: Edge<Triple<AnnotonNode>>) => {
      return edge.metadata;
    });

    saveData.graph = graph;
    console.log(graph);
    console.log(saveData);

    return saveData;
  }

  createEdit(srcAnnoton: Annoton) {
    const self = this;
    const srcSaveData = srcAnnoton.createSave();
    const destSaveData = self.createSave();
    const saveData = {
      srcNodes: srcSaveData.nodes,
      destNodes: destSaveData.nodes,
      srcTriples: srcSaveData.triples,
      destTriples: destSaveData.triples,
      removeIds: subtractNodes(srcSaveData.graph, destSaveData.graph).map((node: AnnotonNode) => {
        return node.uuid;
      }),
      removeTriples: []
    };

    console.log(saveData);
    return saveData;
  }

  createDelete() {
    const self = this;
    const deleteData = {
      uuids: [],
      triples: []
    };
    const uuids: string[] = [];

    each(self.nodes, (node: AnnotonNode) => {
      if (node.hasValue()) {
        uuids.push(node.uuid);
      }
    });

    deleteData.uuids = uuids;

    return deleteData;
  }

  setPreview() {
    const self = this;
    const saveData = self.createSave();

    self.graphPreview.nodes = <NgxNode[]>saveData.nodes.map((node: AnnotonNode) => {
      return {
        id: node.id,
        label: node.term.label ? node.term.label : '',
      };
    });

    self.graphPreview.edges = <NgxEdge[]>saveData.triples.map((triple: Triple<AnnotonNode>) => {
      return {
        source: triple.subject.id,
        target: triple.object.id,
        label: triple.predicate.edge.label
      };
    });
  }

  get presentation() {
    const self = this;

    if (this._presentation) {
      return this._presentation;
    }

    const gp = self.getNode(AnnotonNodeType.GoMolecularEntity);
    const mf = self.getNode(AnnotonNodeType.GoMolecularFunction);
    const gpText = gp ? gp.getTerm().label : '';
    const mfText = mf ? mf.getTerm().label : '';
    let qualifier = '';
    let title = '';

    if (self.annotonType === AnnotonType.ccOnly) {
      title = gpText;
    } else {
      qualifier = mf.isComplement ? 'NOT' : '';
      title = `enabled by ${gpText}`;
    }

    const result = {
      qualifier: qualifier,
      title: title,
      gpText: gpText,
      mfText: mfText,
      gp: {},
      fd: {},
      extra: []
    };

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

    return this._presentation;
  }

  resetPresentation() {
    this._presentation = null;
  }

  generateGrid() {
    const self = this;
    self._grid = [];

    each(self.presentation.fd, function (nodeGroup) {
      each(nodeGroup.nodes, function (node: AnnotonNode) {
        let term = node.getTerm();

        if (node.id !== AnnotonNodeType.GoMolecularEntity && term.id) {
          self.generateGridRow(node);
        }
      });
    });
  }

  generateGridRow(node: AnnotonNode) {
    const self = this;
    const term = node.getTerm();

    self._grid.push({
      displayEnabledBy: self.tableCanDisplayEnabledBy(node),
      treeLevel: node.treeLevel,
      gp: self.tableDisplayGp(node),
      qualifier: node.isExtension ? '' : self.tableDisplayQualifier(node),
      relationship: node.isExtension ? '' : self.tableDisplayRelationship(node),
      relationshipExt: node.isExtension ? node.relationship.label : '',
      term: node.isExtension ? null : term,
      extension: node.isExtension ? term : null,
      aspect: node.aspect,
      evidence: node.predicate.evidence.length > 0 ? node.predicate.evidence[0].evidence : {},
      reference: node.predicate.evidence.length > 0 ? node.predicate.evidence[0].reference : {},
      with: node.predicate.evidence.length > 0 ? node.predicate.evidence[0].with : {},
      assignedBy: node.predicate.evidence.length > 0 ? node.predicate.evidence[0].assignedBy : {},
      evidenceIndex: 0,
      node: node
    });

    for (let i = 1; i < node.predicate.evidence.length; i++) {
      self._grid.push({
        treeLevel: node.treeLevel,
        evidence: node.predicate.evidence[i].evidence,
        reference: node.predicate.evidence[i].reference,
        with: node.predicate.evidence[i].with,
        assignedBy: node.predicate.evidence[i].assignedBy,
        evidenceIndex: i,
        node: node,
      });
    }
  }

  tableDisplayGp(node: AnnotonNode) {
    const self = this;

    let display = false;

    switch (self.annotonType) {
      case noctuaFormConfig.annotonType.options.default.name:
      case noctuaFormConfig.annotonType.options.bpOnly.name:
        display = node.id === AnnotonNodeType.GoMolecularFunction;
        break;
      case noctuaFormConfig.annotonType.options.ccOnly.name:
        display = node.id === 'cc';
        break;
    }
    return display ? self.gp : '';
  }

  tableCanDisplayEnabledBy(node: AnnotonNode) {
    const self = this;

    return node.relationship.id === noctuaFormConfig.edge.enabledBy.id;
  }

  tableDisplayQualifier(node: AnnotonNode) {
    const self = this;

    if (node.id === AnnotonNodeType.GoMolecularFunction) {
      return '';
    } else if (node.isComplement) {
      return 'NOT';
    } else {
      return '';
    }
  }

  tableDisplayRelationship(node: AnnotonNode) {
    const self = this;

    if (node.id === AnnotonNodeType.GoMolecularFunction) {
      return '';
    } else {
      return node.relationship.label;
    }
  }

  print() {
    const result = []
    this.nodes.forEach((node) => {
      const a = [];

      node.predicate.evidence.forEach((evidence: Evidence) => {
        a.push({
          evidence: evidence.evidence,
          reference: evidence.reference,
          with: evidence.with
        });
      });

      result.push({
        id: node.id,
        term: node.term,
        evidence: a
      });
    });

    console.log(result, JSON.stringify(result))
    return result;
  }
}
