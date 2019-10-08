declare const require: any;
const uuid = require('uuid/v1');
import { Edge as NgxEdge, Node as NgxNode } from '@swimlane/ngx-graph';
import { noctuaFormConfig } from './../../noctua-form-config';
import { SaeGraph } from './sae-graph';
import { getEdges, Edge, getNodes, subtractNodes, subtractEdges } from './noctua-form-graph';

import { Annoton } from './annoton';
import { AnnotonNode } from './annoton-node';
import { ConnectorRule } from './rules';
import { Entity } from './entity';
import { Triple } from './triple';
import { Evidence } from './evidence';
import { Predicate } from './predicate';
import { cloneDeep } from 'lodash';

export enum ConnectorState {
  creation = 1,
  editing
}

export enum ConnectorType {
  basic = 1,
  intermediate
}

export class ConnectorAnnoton extends SaeGraph<AnnotonNode> {
  id: string;
  upstreamAnnoton: Annoton;
  downstreamAnnoton: Annoton;
  upstreamNode: AnnotonNode;
  downstreamNode: AnnotonNode;
  processNode: AnnotonNode;
  hasInputNode: AnnotonNode;
  predicate: Predicate;
  state: ConnectorState;
  type: ConnectorType = ConnectorType.basic;
  rule: ConnectorRule;

  graphPreview = {
    nodes: [],
    edges: []
  };

  constructor(upstreamNode?: AnnotonNode, downstreamNode?: AnnotonNode, state?: ConnectorState) {
    super();
    this.id = uuid();

    this.upstreamNode = upstreamNode;
    this.downstreamNode = downstreamNode;
    this.state = state ? state : ConnectorState.creation;
    this.rule = new ConnectorRule();

    if (upstreamNode) {
      this.rule.subjectMFCatalyticActivity.condition = upstreamNode.isCatalyticActivity;
      this.rule.objectMFCatalyticActivity.condition = downstreamNode.isCatalyticActivity;
    }
  }

  setRule() {
    const self = this;

    self.rule.annotonsConsecutive.condition = self.getIsConsecutiveByEdge(self.rule.r1Edge);
    self.rule.effectDirection.direction = self.getEffectDirectionByEdge(self.rule.r1Edge);

    if (self.type === ConnectorType.basic) {
      self.rule.effectDependency.condition = false;
      self.rule.displaySection.causalReactionProduct = false;
      self.rule.displaySection.effectDependency = false;
      self.rule.displaySection.process = false;
    } else if (self.type === ConnectorType.intermediate) {
      self.rule.effectDependency.condition = true;
      self.rule.displaySection.effectDependency = true;
      self.rule.displaySection.process = true;
    }
  }

  checkConnection(value: any) {
    const self = this;

    self.rule.annotonsConsecutive.condition = value.annotonsConsecutive;
    self.rule.displaySection.causalEffect = true;
    self.rule.displaySection.causalReactionProduct = false;
    self.rule.displaySection.effectDependency = value.annotonsConsecutive;
    self.rule.displaySection.process = value.effectDependency;
    self.rule.effectDependency.condition = value.annotonsConsecutive && value.effectDependency;
    self.type = self.rule.effectDependency.condition ? ConnectorType.intermediate : ConnectorType.basic;

    if (!self.rule.effectDependency.condition) {
      if (self.rule.subjectMFCatalyticActivity.condition && self.rule.objectMFCatalyticActivity.condition) {
        self.rule.displaySection.causalReactionProduct = true;
      } else {
        self.rule.displaySection.causalReactionProduct = false;
      }
    }

    if (value.process) {
      self.processNode.term = new Entity(value.process.id, value.process.label);
      self.rule.r2Edge = value.process.edge;
    }

    self.rule.r1Edge = this.getCausalConnectorEdge(
      value.causalEffect,
      value.annotonsConsecutive,
      value.effectDependency,
      value.causalReactionProduct);

    self.setPreview();
  }

  getIsConsecutiveByEdge(edge) {
    const result = edge.id === noctuaFormConfig.edge.causallyUpstreamOfPositiveEffect.id ||
      edge.id === noctuaFormConfig.edge.causallyUpstreamOfNegativeEffect.id ||
      edge.id === noctuaFormConfig.edge.causallyUpstreamOf.id;

    return !result;
  }

  getEffectDirectionByEdge(edge) {
    let effectDirection = noctuaFormConfig.causalEffect.options.positive;

    switch (edge.id) {
      case noctuaFormConfig.edge.causallyUpstreamOfNegativeEffect.id:
      case noctuaFormConfig.edge.directlyNegativelyRegulates.id:
      case noctuaFormConfig.edge.negativelyRegulates.id:
        effectDirection = noctuaFormConfig.causalEffect.options.negative;
        break;
      case noctuaFormConfig.edge.causallyUpstreamOf.id:
      case noctuaFormConfig.edge.directlyRegulates.id:
      case noctuaFormConfig.edge.regulates.id:
        effectDirection = noctuaFormConfig.causalEffect.options.neutral;
        break;
    }

    return effectDirection;
  }

  getCausalConnectorEdge(causalEffect, annotonsConsecutive, effectDependency, causalReactionProduct) {
    const self = this;
    let result;

    if (annotonsConsecutive && causalReactionProduct.name === noctuaFormConfig.causalReactionProduct.options.substrate.name) {
      return noctuaFormConfig.edge.directlyProvidesInput;
    }

    switch (causalEffect.name) {
      case noctuaFormConfig.causalEffect.options.positive.name:
        result = annotonsConsecutive ?
          effectDependency ? noctuaFormConfig.edge.positivelyRegulates :
            noctuaFormConfig.edge.directlyPositivelyRegulates :
          noctuaFormConfig.edge.causallyUpstreamOfPositiveEffect;
        break;
      case noctuaFormConfig.causalEffect.options.negative.name:
        result = annotonsConsecutive ?
          effectDependency ? noctuaFormConfig.edge.negativelyRegulates :
            noctuaFormConfig.edge.directlyNegativelyRegulates :
          noctuaFormConfig.edge.causallyUpstreamOfNegativeEffect;
        break;
      case noctuaFormConfig.causalEffect.options.neutral.name:
        result = annotonsConsecutive ?
          effectDependency ? noctuaFormConfig.edge.regulates :
            noctuaFormConfig.edge.directlyRegulates :
          noctuaFormConfig.edge.causallyUpstreamOf;
        break;
    }

    return result;
  }

  setPreview() {
    this.graphPreview.nodes = [...this._getPreviewNodes()];
    this.graphPreview.edges = [...this._getPreviewEdges()];
  }

  private _getPreviewNodes(): NgxNode[] {
    const self = this;
    let nodes: NgxNode[] = [];

    let annotonNodes = [self.upstreamNode, self.downstreamNode];

    if (self.type === ConnectorType.intermediate) {
      annotonNodes.push(self.processNode);

      if (self.hasInputNode.hasValue()) {
        annotonNodes.push(self.hasInputNode)
      }
    }

    nodes = <NgxNode[]>annotonNodes.map((node: AnnotonNode) => {
      return {
        id: node.id,
        label: node.term.label ? node.term.label : '',
      };
    });

    return nodes;
  }

  copyValues(currentConnectorAnnoton: ConnectorAnnoton) {
    const self = this;

    self.processNode.term = cloneDeep(currentConnectorAnnoton.processNode.term);
    self.hasInputNode.term = cloneDeep(currentConnectorAnnoton.hasInputNode.term);
    self.rule = cloneDeep(currentConnectorAnnoton.rule);
    self.type = currentConnectorAnnoton.type;
    self.state = currentConnectorAnnoton.state;
  }

  createSave() {
    const self = this;
    const saveData = {
      title: '',
      nodes: [],
      triples: [],
      graph: null
    };

    const graph = self.getTrimmedGraph('upstream');
    const keyNodes = getNodes(graph);
    const edges: Edge<Triple<AnnotonNode>>[] = getEdges(graph);
    const triples: Triple<AnnotonNode>[] = edges.map((edge: Edge<Triple<AnnotonNode>>) => {
      return edge.metadata;
    });

    saveData.nodes = Object.values(keyNodes);
    saveData.triples = triples;
    saveData.graph = graph;

    return saveData;
  }

  createEdit(srcAnnoton: ConnectorAnnoton) {
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
      removeTriples: <Triple<AnnotonNode>[]>subtractEdges(srcSaveData.graph, destSaveData.graph)
    };

    console.log(saveData);
    return saveData;
  }

  createDelete() {
    const self = this;
    const uuids: string[] = [];

    const deleteData = {
      uuids: [],
      triples: [],
      nodes: []
    };

    if (this.type === ConnectorType.basic) {
      deleteData.triples.push(new Triple(self.upstreamNode, self.predicate, self.downstreamNode));
    } else if (this.type === ConnectorType.intermediate) {
      uuids.push(self.processNode.uuid);
      if (self.hasInputNode.hasValue()) {
        uuids.push(self.hasInputNode.uuid);
      }
    }

    deleteData.uuids = uuids;

    return deleteData;
  }

  createGraph(srcEvidence?: Evidence[]) {
    const self = this;
    const evidence = srcEvidence ? srcEvidence : self.predicate.evidence;

    if (this.type === ConnectorType.basic) {
      this.addNodes(self.upstreamNode, self.downstreamNode);
      self.addEdge(self.upstreamNode, self.downstreamNode, new Predicate(this.rule.r1Edge, evidence));
    } else if (this.type === ConnectorType.intermediate) {
      self.addNodes(self.upstreamNode, self.downstreamNode, self.processNode);
      self.addEdge(self.upstreamNode, self.processNode, new Predicate(this.rule.r1Edge, evidence));
      self.addEdge(self.processNode, self.downstreamNode, new Predicate(this.rule.r2Edge, evidence));
      if (this.hasInputNode.hasValue()) {
        self.addNodes(self.hasInputNode);
        self.addEdge(self.processNode, self.hasInputNode, new Predicate(new Entity(noctuaFormConfig.edge.hasInput.id, noctuaFormConfig.edge.hasInput.label), evidence));
      }
    }
  }

  prepareSave(value) {
    const self = this;

    const evidence: Evidence[] = value.evidenceFormArray.map((evidence: Evidence) => {
      const result = new Evidence();

      result.uuid = evidence.uuid;
      result.evidence = new Entity(evidence.evidence.id, evidence.evidence.label);
      result.reference = evidence.reference;
      result.with = evidence.with;

      return result;
    });

    if (this.type === ConnectorType.intermediate) {
      self.processNode.term = new Entity(value.process.id, value.process.label);
      self.hasInputNode.term = new Entity(value.hasInput.id, value.hasInput.label);
    }

    this.createGraph(evidence);
  }

  private _getPreviewEdges(): NgxEdge[] {
    const self = this;

    let edges: NgxEdge[] = [];

    if (self.type === ConnectorType.basic) {
      edges = <NgxEdge[]>[
        {
          source: 'upstream',
          target: 'downstream',
          label: self.rule.r1Edge.label
        }
      ]
    } else if (self.type === ConnectorType.intermediate) {
      edges = <NgxEdge[]>[
        {
          source: 'upstream',
          target: 'process',
          label: self.rule.r1Edge.label
        }, {
          source: 'process',
          target: 'downstream',
          label: self.rule.r2Edge ? self.rule.r2Edge.label : ''
        },
      ]
      if (this.hasInputNode.hasValue()) {
        edges.push({
          source: 'process',
          target: 'has-input',
          label: noctuaFormConfig.edge.hasInput.label
        });
      }
    }

    return edges;
  }
}