import { v4 as uuid } from 'uuid';
import { Edge as NgxEdge, Node as NgxNode } from '@swimlane/ngx-graph';
import { noctuaFormConfig } from './../../noctua-form-config';
import { SaeGraph } from './sae-graph';
import { ActivityError, ErrorLevel, ErrorType } from './parser/activity-error';
import { ActivityNode, ActivityNodeType, compareNodeWeight } from './activity-node';
import { Evidence } from './evidence';
import { compareTripleWeight, Triple } from './triple';
import { Entity } from './entity';
import { Predicate } from './predicate';
import { getEdges, Edge, getNodes, subtractNodes } from './noctua-form-graph';
import * as ShapeDescription from './../../data/config/shape-definition';
import { each, filter, find } from 'lodash';
import { NoctuaFormUtils } from './../../utils/noctua-form-utils';
import { Violation } from './error/violation-error';
import { TermsSummary } from './summary';


import moment from 'moment';

export enum ActivityState {
  creation = 1,
  editing
}

export enum ActivitySortField {
  GP = 'gp',
  MF = 'mf',
  BP = 'bp',
  CC = 'cc',
  DATE = 'date'
}

export enum ActivityDisplayType {
  TABLE = 'table',
  TREE = 'tree',
  TREE_TABLE = 'tree_table', //for ART
  SLIM_TREE = 'slim_tree',
  GRAPH = 'graph'
}

export enum ActivityType {
  default = 'default',
  bpOnly = 'bpOnly',
  ccOnly = 'ccOnly',
  molecule = 'molecule',
  proteinComplex = 'proteinComplex'
}

export class ActivitySize {
  width: number = 150;
  height: number = 150;

  constructor() {

  }
}

export class ActivityPosition {
  x: number = 0;
  y: number = 0;

  constructor() {

  }
}

export class Activity extends SaeGraph<ActivityNode> {
  gp;
  label: string;
  date: moment.Moment;

  validateEvidence = true;

  activityRows;
  activityType;
  errors;
  submitErrors;
  modified = false;
  expanded = false;
  visible = true;
  graphPreview = {
    nodes: [],
    edges: []
  };

  molecularEntityNode: ActivityNode;
  molecularFunctionNode: ActivityNode;
  summary: TermsSummary = new TermsSummary()

  //For Display Only
  gpNode: ActivityNode;
  mfNode: ActivityNode;
  bpNode: ActivityNode;
  ccNode: ActivityNode;

  /**
   * Used for HTML id attribute
   */
  activityDisplayType: ActivityDisplayType = ActivityDisplayType.TREE;
  displayId: string;
  displayNumber = '1';

  hasViolations = false;
  violations: Violation[] = [];

  bpOnlyEdge: Entity;
  ccOnlyEdge: Entity;

  //Graph
  position: ActivityPosition = new ActivityPosition();
  size: ActivitySize = new ActivitySize();

  formattedDate: string

  private _backgroundColor = 'green'
  private _presentation: any;
  private _id: string;

  constructor() {
    super();
    this.activityType = 'default';
    this.id = uuid();
    this.errors = [];
    this.submitErrors = [];
  }

  updateProperties() {
    this.updateSummary()
    this.updateDate()

    this.gpNode = this.getGPNode()
    this.mfNode = this.getMFNode()
    this.bpNode = this.getRootNodeByType(ActivityNodeType.GoBiologicalProcess)
    this.ccNode = this.getRootNodeByType(ActivityNodeType.GoCellularComponent)

  }

  get id() {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
    this.displayId = NoctuaFormUtils.cleanID(id) + 'activity';
  }

  get backgroundColor() {
    switch (this.activityType) {
      case ActivityType.ccOnly:
        return 'purple'
      case ActivityType.bpOnly:
        return 'brown'
      case ActivityType.molecule:
        return 'teal'
      default:
        return this._backgroundColor;
    }
  }

  get activityConnections() {
    throw new Error('Method not implemented');
  }

  get rootNodeType(): ActivityNodeType {
    if (this.activityType === ActivityType.ccOnly) {
      return ActivityNodeType.GoMolecularEntity
    } else if (this.activityType === ActivityType.molecule) {
      return ActivityNodeType.GoChemicalEntity;
    } else {
      return ActivityNodeType.GoMolecularFunction
    }
  }

  get rootNode(): ActivityNode {
    return this.getNode(this.rootNodeType);
  }

  get rootEdge(): Triple<ActivityNode> {
    let edge;

    if (this.activityType === ActivityType.proteinComplex) {
      edge = this.getEdge(ActivityNodeType.GoMolecularFunction, ActivityNodeType.GoProteinContainingComplex);
    } else {
      edge = this.getEdge(ActivityNodeType.GoMolecularFunction, ActivityNodeType.GoMolecularEntity);
    }

    return edge
  }

  postRunUpdateCompliment() {
    const self = this;

    if (this.activityType === ActivityType.default || this.activityType === ActivityType.bpOnly) {
      const mfNode = self.getMFNode();
      const edge = self.getEdge(ActivityNodeType.GoMolecularFunction, ActivityNodeType.GoMolecularEntity);

      if (mfNode && edge && mfNode.isComplement) {
        edge.predicate.isComplement = true;
      }
    }
  }


  postRunUpdate() {
    const self = this;

    if (this.activityType !== ActivityType.ccOnly) {
      const mfNode = self.getMFNode();
      const edge = self.rootEdge;

      if (mfNode && edge) {
        mfNode.predicate = edge.predicate;
        if (edge.predicate.edge) {
          edge.predicate.edge.label = ''
        }
      }
    }
  }

  getActivityTypeDetail() {
    return noctuaFormConfig.activityType.options[this.activityType];
  }

  updateDate() {
    const self = this;
    const rootNode = this.rootNode;

    if (!rootNode) return;

    self.date = (moment as any)(rootNode.date, 'YYYY-MM-DD')
    // self.date = rootNode.date

    each(self.nodes, (node: ActivityNode) => {
      const nodeDate = (moment as any)(node.date, 'YYYY-MM-DD')

      if (nodeDate > self.date) {
        self.date = nodeDate
      }
    });

    // remove the subject menu
    each(self.edges, (triple: Triple<ActivityNode>) => {
      each(triple.predicate.evidence, (evidence: Evidence) => {

        const evidenceDate = (moment as any)(evidence.date, 'YYYY-MM-DD')

        if (evidenceDate > self.date) {
          self.date = evidenceDate
        }
      })
    });

    this.formattedDate = self.date.format('ll');
  }

  updateSummary() {
    const self = this;
    let summary = new TermsSummary()
    let coverage = 0;
    const filteredNodes = self.nodes.filter(node => node.term.hasValue())

    each(filteredNodes, (node: ActivityNode) => {
      if (node.type === ActivityNodeType.GoMolecularFunction) {
        summary.mf.append(node)
      } else if (node.type === ActivityNodeType.GoBiologicalProcess) {
        summary.bp.append(node)
      } else if (node.type === ActivityNodeType.GoCellularComponent) {
        summary.cc.append(node)
      } else {
        summary.other.append(node)
      }
    })

    if (summary.mf.nodes.length > 0) {
      coverage = coverage | 4
    }
    if (summary.bp.nodes.length > 0) {
      coverage = coverage | 2
    }
    if (summary.cc.nodes.length > 0) {
      coverage = coverage | 1
    }

    summary.coverage = coverage;

    this.summary = summary
  }

  updateEntityInsertMenu() {
    const self = this;

    each(self.nodes, (node: ActivityNode) => {
      const canInsertNodes = ShapeDescription.canInsertEntity[node.type] || [];
      const insertNodes: ShapeDescription.ShapeDescription[] = [];

      each(canInsertNodes, (nodeDescription: ShapeDescription.ShapeDescription) => {
        if (nodeDescription.cardinality === ShapeDescription.CardinalityType.oneToOne) {
          const edgeTypeExist = self.edgeTypeExist(node.id, nodeDescription.predicate.id, node.type, nodeDescription.node.type);

          if (!edgeTypeExist) {
            insertNodes.push(nodeDescription);
          }
        } else {
          insertNodes.push(nodeDescription);
        }
      });

      node.canInsertNodes = insertNodes;
      node.insertMenuNodes = filter(insertNodes, (insertNode: ShapeDescription.ShapeDescription) => {
        return insertNode.node.showInMenu;
      });
    });

    // remove the subject menu
    each(self.edges, function (triple: Triple<ActivityNode>) {
      if (triple.subject.type === triple.object.type) {
        //triple.subject.canInsertNodes = [];
        // triple.subject.insertMenuNodes = [];
      }
    });
  }

  updateEdges(subjectNode: ActivityNode, insertNode: ActivityNode, predicate: Predicate) {
    const self = this;
    const canInsertSubjectNodes = ShapeDescription.canInsertEntity[subjectNode.type] || [];
    let updated = false;

    each(canInsertSubjectNodes, (nodeDescription: ShapeDescription.ShapeDescription) => {

      if (predicate.edge.id === nodeDescription.predicate.id) {
        if (nodeDescription.cardinality === ShapeDescription.CardinalityType.oneToOne) {
          const edgeTypeExist = self.edgeTypeExist(subjectNode.id, nodeDescription.predicate.id, subjectNode.type, nodeDescription.node.type);

          if (edgeTypeExist) {
            edgeTypeExist.object.treeLevel++;
            self.removeEdge(edgeTypeExist.subject, edgeTypeExist.object, edgeTypeExist.predicate);
            self.addEdge(edgeTypeExist.subject, insertNode, edgeTypeExist.predicate);
            self.addEdge(insertNode, edgeTypeExist.object, predicate);
            updated = true;

            return false;
          }
        }
      }
    });

    if (!updated) {
      self.addEdgeById(subjectNode.id, insertNode.id, predicate);
    }

  }

  edgeList(node: ActivityNode, object: ActivityNode) {
    const self = this;
    const canInsertNodes = ShapeDescription.canInsertEntity[node.type] || [];

    const insertNodes: ShapeDescription.ShapeDescription[] = [];

    each(canInsertNodes, (nodeDescription: ShapeDescription.ShapeDescription) => {
      if (nodeDescription.node.category === object.category) {
        insertNodes.push(nodeDescription);
      }
    });

    return insertNodes;
  }

  getNodesByType(type: ActivityNodeType): ActivityNode[] {
    const self = this;
    const result = filter(self.nodes, (activityNode: ActivityNode) => {
      return activityNode.type === type;
    });

    return result;
  }

  getGPNode() {
    const self = this;

    if (self.activityType === ActivityType.proteinComplex) {
      return self.getNode(ActivityNodeType.GoProteinContainingComplex);
    }

    if (self.activityType === ActivityType.molecule) {
      return self.getNode(ActivityNodeType.GoChemicalEntity);
    }

    return self.getNode(ActivityNodeType.GoMolecularEntity);
  }

  getFDRootNode() {
    const self = this;

    if (self.activityType === ActivityType.molecule) {
      return self.getNode(ActivityNodeType.GoCellularComponent);
    }

    return self.getNode(ActivityNodeType.GoMolecularFunction);
  }

  getMFNode() {
    const self = this;

    return self.getNode(ActivityNodeType.GoMolecularFunction);
  }

  getBPNode() {
    const self = this;

    return self.getNode(ActivityNodeType.GoBiologicalProcess);
  }

  getCCNode() {
    const self = this;

    return self.getNode(ActivityNodeType.GoCellularComponent);
  }

  getRootNodeByType(type: ActivityNodeType): ActivityNode {
    const self = this;
    const rootEdges = this.getEdges(this.rootNode.id)
    const found = find(rootEdges, ((node: Triple<ActivityNode>) => {
      return node.object.type === type
    }))

    if (!found) return null

    return found.object;
  }

  adjustCC() {
    const self = this;
    const ccNode = self.getNode(ActivityNodeType.GoCellularComponent);

    if (ccNode && !ccNode.hasValue()) {
      const ccEdges: Triple<ActivityNode>[] = this.getEdges(ccNode.id);

      if (ccEdges.length > 0) {
        const firstEdge = ccEdges[0];
        const rootCC = noctuaFormConfig.rootNode.cc;
        ccNode.term = new Entity(rootCC.id, rootCC.label);
        ccNode.predicate.evidence = firstEdge.predicate.evidence;

      }
    }
  }

  getViolationDisplayErrors() {
    const self = this;
    const result = [];

    result.push(...self.violations.map((violation: Violation) => {
      return violation.getDisplayError();
    }));

    return result;
  }

  adjustActivity() {
    const self = this;

    if (self.activityType === noctuaFormConfig.activityType.options.bpOnly.name) {
      const rootMF = noctuaFormConfig.rootNode.mf;
      const mfNode = self.getMFNode();
      const bpNode = self.getNode(ActivityNodeType.GoBiologicalProcess);
      const bpEdge = self.getEdge(mfNode.id, bpNode.id);

      mfNode.term = new Entity(rootMF.id, rootMF.label);
      mfNode.predicate.evidence = bpNode.predicate.evidence;

      if (self.bpOnlyEdge) {
        bpEdge.predicate.edge.id = bpNode.predicate.edge.id = self.bpOnlyEdge.id;
        bpEdge.predicate.edge.label = bpNode.predicate.edge.label = self.bpOnlyEdge.label;
      }

    }

    if (self.activityType !== ActivityType.ccOnly && self.activityType !== ActivityType.molecule) {
      const mfNode = self.getMFNode();
      const edge = self.rootEdge;

      if (mfNode && edge) {
        edge.predicate.evidence = mfNode.predicate.evidence;
      }
    }
  }


  copyValues(srcActivity) {
    const self = this;

    each(self.nodes, function (destNode: ActivityNode) {
      const srcNode = srcActivity.getNode(destNode.id);
      if (srcNode) {
        destNode.copyValues(srcNode);
      }
    });
  }

  setActivityType(type) {
    this.activityType = type;
  }

  getEdgesByEdgeId(edgeId: string): Triple<ActivityNode>[] {
    const self = this;
    const found = filter(self.edges, ((node: Triple<ActivityNode>) => {
      return node.predicate.edge.id === edgeId
    }))

    if (!found) return null

    return found;
  }


  enableSubmit() {
    const self = this;
    let result = true;

    self.submitErrors = [];

    each(self.nodes, (node: ActivityNode) => {
      result = node.enableSubmit(self.submitErrors, this.validateEvidence) && result;
    });

    if (self.activityType === ActivityType.bpOnly) {
      if (!self.bpOnlyEdge) {
        const meta = {
          aspect: 'Molecular Function'
        };
        const error = new ActivityError(ErrorLevel.error, ErrorType.general, `Causal relation is required`, meta);
        self.submitErrors.push(error);
        result = false;
      }
    }

    if (self.nodes.length < 2) {
      const error = new ActivityError(ErrorLevel.error, ErrorType.general, `At least 2 nodes are required`);
      self.submitErrors.push(error);
      result = false;
    }

    return result;
  }

  createSave() {
    const self = this;
    const saveData = {
      title: 'enabled by ' + self.getNode(ActivityNodeType.GoMolecularEntity)?.term.label,
      triples: [],
      nodes: [],
      graph: null
    };

    self.adjustCC();
    self.adjustActivity();

    const graph = self.getTrimmedGraph(this.rootNodeType);
    const keyNodes = getNodes(graph);
    const edges: Edge<Triple<ActivityNode>>[] = getEdges(graph);

    saveData.nodes = Object.values(keyNodes);

    saveData.triples = edges.map((edge: Edge<Triple<ActivityNode>>) => {
      return edge.metadata;
    });

    saveData.graph = graph;

    return saveData;
  }

  createCCSave() {
    const self = this;
    const ccEdges: Triple<ActivityNode>[] = self.getEdges(self.rootNode.id);

    each(ccEdges, (ccEdge: Triple<ActivityNode>) => {
      const activity = new Activity()
      activity.addNode(self.rootNode)
      activity.addEdge(ccEdge.subject, ccEdge.object, ccEdge.predicate)
    });
  }

  createEdit(srcActivity: Activity) {
    const self = this;
    const srcSaveData = srcActivity.createSave();
    const destSaveData = self.createSave();
    const saveData = {
      addNodes: destSaveData.nodes,
      addTriples: destSaveData.triples,
      removeIds: subtractNodes(srcSaveData.graph, destSaveData.graph).map((node: ActivityNode) => {
        return node.uuid;
      }),
      removeTriples: []
    };

    return saveData;
  }

  createEditEvidence(srcActivity: Activity, predicate: Predicate) {
    const self = this;

    const removeTriples = srcActivity.getEdge(predicate.subjectId, predicate.objectId)
    const addTriples = self.getEdge(predicate.subjectId, predicate.objectId)

    const saveData = {
      addTriples: addTriples,
      removeTriples: removeTriples,
    };

    return saveData;
  }

  createAddIndividual(srcActivity: Activity, predicate: Predicate) {
    const self = this;

    const addTriples = self.getEdge(predicate.subjectId, predicate.objectId)

    const saveData = {
      addTriples: addTriples,
    };

    return saveData;
  }

  createDelete() {
    const self = this;
    const deleteData = {
      uuids: [],
      triples: []
    };
    const uuids: string[] = [];

    each(self.nodes, (node: ActivityNode) => {
      if (node.hasValue()) {
        uuids.push(node.uuid);
      }
    });

    deleteData.uuids = uuids;

    return deleteData;
  }

  createActivityNodeDelete(node: ActivityNode) {
    const self = this;
    const deleteData = {
      uuids: []
    };
    const uuids = self.descendants(node.id).map(node => node.uuid);
    uuids.push(node.uuid);

    deleteData.uuids = uuids;

    return deleteData;
  }

  setPreview() {
    const self = this;
    const saveData = self.createSave();

    self.graphPreview.nodes = <NgxNode[]>saveData.nodes.map((node: ActivityNode) => {
      return {
        id: node.id,
        label: node.term.label ? node.term.label : '',
      };
    });

    self.graphPreview.edges = <NgxEdge[]>saveData.triples.map((triple: Triple<ActivityNode>) => {
      return {
        source: triple.subject.id,
        target: triple.object.id,
        label: triple.predicate.edge.label
      };
    });
  }

  insertSubgraph(activity: Activity, toNode: ActivityNode, fromNode: ActivityNode) {
    const self = this;

    const graph = activity.getTrimmedGraph(fromNode.id);

    // self.addSubGraph(graph, toNode.id, fromNode.id);
  }

  get title() {
    const self = this;
    const gp = self.getGPNode();
    const gpText = gp ? gp.getTerm().label : '';
    let title = '';

    if (self.activityType === ActivityType.ccOnly ||
      self.activityType === ActivityType.molecule) {
      title = gpText;
    } else {
      title = `enabled by (${gpText})`;
    }

    return title;
  }

  buildTrees(): ActivityTreeNode[] {
    const self = this;
    const sortedEdges = self.edges.sort(compareTripleWeight);
    const fdRootNode = self.getFDRootNode();

    if (!fdRootNode) return [];
    return [self._buildTree(sortedEdges, fdRootNode)];
  }

  buildGPTrees(): ActivityTreeNode[] {
    const self = this;
    const sortedEdges = self.edges.sort(compareTripleWeight);

    return [self._buildTree(sortedEdges, self.gpNode)];
  }

  private _buildTree(triples: Triple<ActivityNode>[], rootNode: ActivityNode): ActivityTreeNode {
    const self = this;
    if (!rootNode) return;
    const result: ActivityTreeNode[] = [new ActivityTreeNode(rootNode)]
    const getNestedChildren = (arr: ActivityTreeNode[]) => {

      for (const i in arr) {
        const children = []
        for (const j in triples) {
          if (triples[j].subject.id === arr[i].node.id) {
            children.push(new ActivityTreeNode(triples[j].object));
          }
        }

        if (children.length > 0) {
          arr[i].children = children;
          getNestedChildren(children);
        }
      }
    }

    getNestedChildren(result);

    return result[0]
  }


  get presentation() {
    const self = this;

    if (this._presentation) {
      return this._presentation;
    }

    const gp = self.getNode(ActivityNodeType.GoMolecularEntity);
    const mf = self.getNode(ActivityNodeType.GoMolecularFunction);
    const gpText = gp ? gp.getTerm().label : '';
    const mfText = mf ? mf.getTerm().label : '';
    let qualifier = '';
    let title = '';

    if (self.activityType === ActivityType.ccOnly) {
      title = gpText;
    } else if (self.activityType === ActivityType.molecule) {
      title = gpText;
    } else if (self.activityType === ActivityType.proteinComplex) {
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

    const sortedNodes = self.nodes.sort(compareNodeWeight);

    each(sortedNodes, function (node: ActivityNode) {
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

}

export class ActivityTreeNode {
  parentId: string;
  id: string;
  node: ActivityNode;
  children: ActivityTreeNode[];

  constructor(node: ActivityNode, children: ActivityTreeNode[] = []) {
    this.node = node;
    this.id = node.id
    this.children = children;
  }

}

export function compareActivity(a: Activity, b: Activity) {
  return a.id === b.id;
}



