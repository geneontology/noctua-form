
declare const require: any;
const uuid = require('uuid/v1');
import { Edge as NgxEdge, Node as NgxNode, NodeDimension, ClusterNode, Layout } from '@swimlane/ngx-graph';

import { noctuaFormConfig } from './../../noctua-form-config';
import { Annoton } from './annoton'
import { AnnotonNode } from './annoton-node'
import { Group } from '../group';
import { Contributor } from '../contributor';
import { Evidence } from './evidence';
import { Triple } from './triple';
import { Entity } from './entity';
import { ConnectorAnnoton, ConnectorType } from './connector-annoton';
import { each, find } from 'lodash';


export class Cam {

  title: string;
  state: any;
  groups: Group[] = [];
  contributors: Contributor[] = [];
  groupId: any;

  id: string;
  expanded?: boolean;
  model: any;
  annotatedEntity?: {};
  camRow?: any;

  connectorAnnotons: ConnectorAnnoton[] = [];
  triples: Triple<AnnotonNode>[] = [];
  sort;

  error = false;
  engine;
  onGraphChanged;
  manager;
  individualManager;
  groupManager;
  newModelManager;
  graph;
  date;
  modelId;
  summaryExpanded = false;

  ///
  filter = {
    contributor: null,
    uuids: [],
  };

  displayType;

  grid: any = [];
  goterms: Entity[] = [];

  graphPreview = {
    nodes: [],
    edges: []
  };

  private _annotons: Annoton[] = [];

  constructor() {
    this.displayType = noctuaFormConfig.camDisplayType.options.model;
  }

  get annotons() {
    return this._annotons.sort(this._compareMolecularFunction);
  }

  set annotons(srcAnnotons: Annoton[]) {
    const prevAnnotons = this._annotons;

    each(srcAnnotons, (annoton: Annoton) => {
      const prevAnnoton = this.findAnnotonById(annoton.id);

      if (prevAnnoton) {
        annoton.expanded = prevAnnoton.expanded;
      }
    });

    this._annotons = srcAnnotons;
  }

  expandAllAnnotons(expand: boolean) {
    const self = this;

    each(self.annotons, function (annoton: Annoton) {
      annoton.expanded = expand;
    });
  }

  getConnectorAnnoton(upstreamId: string, downstreamId: string): ConnectorAnnoton {
    const self = this;

    return find(self.connectorAnnotons, (connectorAnnoton: ConnectorAnnoton) => {
      return connectorAnnoton.upstreamNode.uuid === upstreamId &&
        connectorAnnoton.downstreamNode.uuid === downstreamId;
    });
  }

  configureDisplayType() {
    if (this.filter.uuids.length > 0) {
      this.displayType = noctuaFormConfig.camDisplayType.options.entity;
    }
  }


  resetFilter() {
    this.filter.contributor = null;
    this.filter.uuids = [];
  }

  findAnnotonById(id) {
    const self = this;

    return find(self.annotons, (annoton) => {
      return annoton.id === id;
    })
  }


  applyFilter() {
    const self = this;

    if (self.filter.uuids.length > 0) {
      self.grid = [];

      each(self.annotons, (annoton: Annoton) => {
        each(annoton.nodes, (node: AnnotonNode) => {
          each(self.filter.uuids, (uuid) => {
            let match = false
            // each(node.evidence, (evidence: Evidence) => {
            //    match = match || (evidence.uuid === uuid);
            //  })
            match = match || (node.uuid === uuid);
            if (match) {
              self.generateGridRow(annoton, node);
            }
          });
        });
      });
    }
  }

  getAnnotonByConnectionId(connectionId) {
    const self = this;
    let result = find(self.annotons, (annoton: Annoton) => {
      return annoton.id === connectionId;
    })

    return result;
  }

  getUniqueEvidences(result?) {
    const self = this;

    if (!result) {
      result = [];
    }

    each(self.annotons, function (annoton: Annoton) {
      each(annoton.edges, function (triple: Triple<AnnotonNode>) {
        each(triple.predicate.evidence, function (evidence: Evidence) {
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

    return find(data, function (x) {
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

  addUniqueEvidencesFromAnnoton(annoton: Annoton) {
    const self = this;
    const result = [];

    each(annoton.nodes, function (node: AnnotonNode) {
      each(node.predicate.evidence, function (evidence: Evidence) {
        if (evidence.hasValue()) {
          if (!self.evidenceExists(result, evidence)) {
            result.push(evidence);
          }
        }
      });
    });

    return result;
  }

  setPreview() {
    const self = this;
    self.graphPreview.edges = [];
    self.graphPreview.nodes = <NgxNode[]>self.annotons.map((annoton: Annoton) => {
      return {
        id: annoton.id,
        label: annoton.presentation.mfText,
        data: {
          annoton: annoton
        }
      };
    });

    each(self.connectorAnnotons, (connectorAnnoton: ConnectorAnnoton) => {
      if (connectorAnnoton.type === ConnectorType.basic) {
        self.graphPreview.edges.push(
          <NgxEdge>{
            source: connectorAnnoton.upstreamNode.uuid,
            target: connectorAnnoton.downstreamNode.uuid,
            label: connectorAnnoton.rule.r1Edge.label,
            data: {
              connectorAnnoton: connectorAnnoton
            }
          });
      } else if (connectorAnnoton.type === ConnectorType.intermediate) {
        self.graphPreview.nodes.push({
          id: connectorAnnoton.processNode.uuid,
          label: connectorAnnoton.processNode.term.label,
          data: {
            connectorAnnoton: connectorAnnoton
          }
        });
        self.graphPreview.edges.push(
          <NgxEdge>{
            source: connectorAnnoton.upstreamNode.uuid,
            target: connectorAnnoton.processNode.uuid,
            label: connectorAnnoton.rule.r1Edge.label,
            data: {
              connectorAnnoton: connectorAnnoton
            }
          });
        self.graphPreview.edges.push(
          <NgxEdge>{
            source: connectorAnnoton.processNode.uuid,
            target: connectorAnnoton.downstreamNode.uuid,
            label: connectorAnnoton.rule.r2Edge.label,
            data: {
              connectorAnnoton: connectorAnnoton
            }
          });
      }
    });

    console.log(self.graphPreview.nodes);
    /*
        self.graphPreview.edges = <NgxEdge[]>triples.map((triple: Triple<AnnotonNode>) => {
          return {
            source: triple.subject.id,
            target: triple.object.id,
            label: triple.predicate.edge.label
          };
        });*/
  }

  generateTripleGrid() {
    let grid = [...this.triples.map((triple) => {
      return triple.grid;
    })]



    console.log(grid)

    return grid;
    //return flattenDeep(grid);
  }



  generateGridRow(annoton: Annoton, node: AnnotonNode) {
    const self = this;

    let term = node.getTerm();

    self.grid.push({
      displayEnabledBy: self.tableCanDisplayEnabledBy(node),
      treeLevel: node.treeLevel,
      relationship: node.isExtension ? '' : self.tableDisplayExtension(node),
      relationshipExt: node.isExtension ? node.relationship.label : '',
      term: node.isExtension ? {} : term,
      extension: node.isExtension ? term : {},
      aspect: node.aspect,
      /*  evidence: node.evidence.length > 0 ? node.evidence[0].evidence : {},
       reference: node.evidence.length > 0 ? node.evidence[0].reference : {},
       with: node.evidence.length > 0 ? node.evidence[0].with : {},
       assignedBy: node.evidence.length > 0 ? node.evidence[0].assignedBy : {}, */
      annoton: annoton,
      node: node
    })
    /* 
        for (let i = 1; i < node.evidence.length; i++) {
          self.grid.push({
            treeLevel: node.treeLevel,
            evidence: node.evidence[i].evidence,
            reference: node.evidence[i].reference,
            with: node.evidence[i].with.control,
            assignedBy: node.evidence[i].assignedBy,
            node: node,
          }) 
        }*/
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

  private _compareMolecularFunction(a: Annoton, b: Annoton): number {
    if (a.presentation.gpText.toLowerCase() < b.presentation.gpText.toLowerCase()) {
      return -1;
    } else {
      return 1;
    }
  }
}

