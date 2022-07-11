import { v4 as uuid } from 'uuid';
import { Edge as NgxEdge, Node as NgxNode } from '@swimlane/ngx-graph';
import { noctuaFormConfig } from './../../noctua-form-config';
import { SaeGraph } from './sae-graph';
import { Activity, ActivityType } from './activity';
import { ActivityNode } from './activity-node';
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
  ACTIVITY_ACTIVITY = 'ACTIVITY_ACTIVITY',
  ACTIVITY_MOLECULE = 'ACTIVITY_MOLECULE',
  MOLECULE_ACTIVITY = 'MOLECULE_ACTIVITY',
};

export class ConnectorActivity extends SaeGraph<ActivityNode> {
  id: string;
  subject: Activity;
  object: Activity;
  subjectNode: ActivityNode;
  objectNode: ActivityNode;
  predicate: Predicate;
  state: ConnectorState;
  rule: ConnectorRule;
  connectorType: ConnectorType
  reverseEdge = false;

  graphPreview = {
    nodes: [],
    edges: []
  };

  constructor(subject: Activity, object: Activity, predicate: Predicate) {
    super();
    this.id = uuid();

    this.subject = subject;
    this.object = object;
    this.predicate = predicate;
    this.rule = new ConnectorRule();
    this.subjectNode = cloneDeep(this.subject.rootNode);
    this.objectNode = this.object.rootNode;
    this.subjectNode.predicate.evidence = predicate.evidence
    this.setConnectorType()
    this.setRule();
    this.setLinkDirection()
    this.createGraph();
    this.setPreview();
  }

  setRule() {
    const self = this;

    if (this.connectorType === ConnectorType.ACTIVITY_MOLECULE) {
      const question = self.edgeToConnectorQuestionAtoM(self.predicate.edge);

      self.rule.directness.directness = question.directness;
    } else if (this.connectorType === ConnectorType.MOLECULE_ACTIVITY) {
      const question = self.edgeToConnectorQuestionMtoA(self.predicate.edge);

      self.rule.chemicalRelationship.relation = question.relationship;
      self.rule.effectDirection.direction = question.causalEffect
    } else {
      const question = self.edgeToConnectorQuestion(self.predicate.edge);

      self.rule.activityRelationship.relation = question.relationship;
      self.rule.effectDirection.direction = question.causalEffect;
      self.rule.directness.directness = question.directness;
    }
  }

  addDefaultEvidence() {
    let activity: Activity;
    if (this.connectorType === ConnectorType.MOLECULE_ACTIVITY) {
      activity = this.object;
    } else {
      activity = this.subject
    }

    const mfNode = activity.getMFNode()
    const gpNode = activity.getGPNode()
    if (gpNode && mfNode) {
      const edge = activity.getEdge(mfNode.id, gpNode.id)
      this.predicate.evidence = cloneDeep(edge.predicate.evidence)
    }
  }

  checkConnection(value: any) {
    const self = this;

    self.rule.displaySection.causalEffect = true;

    if (value.chemicalRelationship) {
      if (value.chemicalRelationship.name === noctuaFormConfig.chemicalRelationship.options.chemicalRegulates.name) {
        self.rule.displaySection.causalEffect = true;
      } else if (value.chemicalRelationship.name === noctuaFormConfig.chemicalRelationship.options.chemicalSubstrate.name) {
        self.rule.displaySection.causalEffect = false;
      }
    }

    if (value.activityRelationship) {
      if (value.activityRelationship.name === noctuaFormConfig.activityRelationship.options.regulation.name) {
        self.rule.displaySection.directionCausalEffect = true;
      } else if (value.activityRelationship.name === noctuaFormConfig.activityRelationship.options.outputInput.name) {
        self.rule.displaySection.directionCausalEffect = false;
      }
    }

    if (this.connectorType === ConnectorType.ACTIVITY_ACTIVITY) {
      self.predicate.edge = this.getCausalConnectorEdge(value.directness, value.causalEffect, value.activityRelationship);
    } else if (this.connectorType === ConnectorType.ACTIVITY_MOLECULE) {
      self.predicate.edge = this.getCausalConnectorEdgeAtoM(value.directness)
    } else if (this.connectorType === ConnectorType.MOLECULE_ACTIVITY) {
      self.predicate.edge = this.getCausalConnectorEdgeMtoA(value.chemicalRelationship, value.causalEffect);
    }


    self.prepareSave(value);

    this.setLinkDirection();
    self.setPreview();
  }

  getCausalConnectorEdge(directness, causalEffect, relationship): Entity {
    let edge = noctuaFormConfig.edge.directlyProvidesInput;

    if (relationship.name === noctuaFormConfig.activityRelationship.options.outputInput.name) {
      edge = noctuaFormConfig.edge.directlyProvidesInput;
    } else if (causalEffect.name === noctuaFormConfig.causalEffect.options.positive.name) {
      if (directness.name === noctuaFormConfig.directness.options.known.name) {
        edge = noctuaFormConfig.edge.positivelyRegulates;
      } else {
        edge = noctuaFormConfig.edge.causallyUpstreamOfPositiveEffect;
      }
    } else if (causalEffect.name === noctuaFormConfig.causalEffect.options.negative.name) {
      if (directness.name === noctuaFormConfig.directness.options.known.name) {
        edge = noctuaFormConfig.edge.negativelyRegulates;
      } else {
        edge = noctuaFormConfig.edge.causallyUpstreamOfNegativeEffect;
      }
    } else if (causalEffect.name === noctuaFormConfig.causalEffect.options.neutral.name) {
      if (directness.name === noctuaFormConfig.directness.options.known.name) {
        edge = noctuaFormConfig.edge.regulates;
      } else {
        edge = noctuaFormConfig.edge.causallyUpstreamOf;
      }
    }

    return Entity.createEntity(edge);
  }

  getCausalConnectorEdgeAtoM(directness): Entity {
    let edge = noctuaFormConfig.edge.hasOutput;

    if (directness.name === noctuaFormConfig.directness.options.chemicalProduct.name) {
      edge = noctuaFormConfig.edge.hasOutput;
    }

    return Entity.createEntity(edge);
  }

  getCausalConnectorEdgeMtoA(relationship, causalEffect): Entity {
    let edge = noctuaFormConfig.edge.isSmallMoleculeActivator;

    if (relationship.name === noctuaFormConfig.chemicalRelationship.options.chemicalRegulates.name) {
      if (causalEffect.name === noctuaFormConfig.causalEffect.options.negative.name) {
        edge = noctuaFormConfig.edge.isSmallMoleculeInhibitor;
      } else if (causalEffect.name === noctuaFormConfig.causalEffect.options.neutral.name) {
        edge = noctuaFormConfig.edge.isSmallMoleculeRegulator;
      }
    } else {
      edge = noctuaFormConfig.edge.hasInput
    }

    const entity = Entity.createEntity(edge);

    if (entity.id === noctuaFormConfig.edge.hasInput.id) {
      entity.label = 'input of'
    }

    return entity
  }

  edgeToConnectorQuestion(edge: Entity) {
    let relationship = noctuaFormConfig.activityRelationship.options.regulation;
    let directness = noctuaFormConfig.directness.options.known;
    let causalEffect = noctuaFormConfig.causalEffect.options.positive;

    if (edge.id === noctuaFormConfig.edge.directlyProvidesInput.id) {
      relationship = noctuaFormConfig.activityRelationship.options.outputInput;
      return { directness, causalEffect, relationship }
    }

    switch (edge.id) {
      case noctuaFormConfig.edge.causallyUpstreamOf.id:
      case noctuaFormConfig.edge.causallyUpstreamOfNegativeEffect.id:
      case noctuaFormConfig.edge.causallyUpstreamOfPositiveEffect.id:
        directness = noctuaFormConfig.directness.options.unknown;
        break;
    }
    switch (edge.id) {
      case noctuaFormConfig.edge.regulates.id:
      case noctuaFormConfig.edge.causallyUpstreamOf.id:
        causalEffect = noctuaFormConfig.causalEffect.options.neutral;
        break;
      case noctuaFormConfig.edge.negativelyRegulates.id:
      case noctuaFormConfig.edge.causallyUpstreamOfNegativeEffect.id:
        causalEffect = noctuaFormConfig.causalEffect.options.negative;
        break;
    }

    return { directness, causalEffect, relationship }
  }

  edgeToConnectorQuestionAtoM(edge: Entity) {
    let directness = noctuaFormConfig.directness.options.chemicalProduct;

    return { directness }
  }

  edgeToConnectorQuestionMtoA(edge: Entity) {
    let relationship = noctuaFormConfig.chemicalRelationship.options.chemicalRegulates
    let causalEffect = noctuaFormConfig.causalEffect.options.positive;

    switch (edge.id) {
      case noctuaFormConfig.edge.hasInput.id:
        relationship = noctuaFormConfig.chemicalRelationship.options.chemicalSubstrate;
        break;
      case noctuaFormConfig.edge.isSmallMoleculeActivator.id:
        causalEffect = noctuaFormConfig.causalEffect.options.positive;
        break;
      case noctuaFormConfig.edge.isSmallMoleculeInhibitor.id:
        causalEffect = noctuaFormConfig.causalEffect.options.negative;
        break;
      case noctuaFormConfig.edge.isSmallMoleculeRegulator.id:
        causalEffect = noctuaFormConfig.causalEffect.options.neutral;
        break;
    }

    return { relationship, causalEffect }
  }

  setConnectorType() {
    if (this.subject.activityType !== ActivityType.molecule && this.object.activityType !== ActivityType.molecule) {
      this.connectorType = ConnectorType.ACTIVITY_ACTIVITY
    } else if (this.subject.activityType !== ActivityType.molecule && this.object.activityType === ActivityType.molecule) {
      this.connectorType = ConnectorType.ACTIVITY_MOLECULE
    } else if (this.subject.activityType === ActivityType.molecule && this.object.activityType !== ActivityType.molecule) {
      this.connectorType = ConnectorType.MOLECULE_ACTIVITY
    }
  }


  setLinkDirection() {
    this.predicate.isReverseLink = (this.connectorType === ConnectorType.MOLECULE_ACTIVITY
      && this.predicate.edge.id === noctuaFormConfig.edge.hasInput.id);
  }

  setPreview() {
    this.graphPreview.nodes = [...this._getPreviewNodes()];
    this.graphPreview.edges = [...this._getPreviewEdges()];
  }

  private _getPreviewNodes(): NgxNode[] {
    const self = this;
    let nodes: NgxNode[] = [];

    let activityNodes = [self.subject, self.object];


    nodes = <NgxNode[]>activityNodes.map((activity: Activity) => {
      const node = activity.getMFNode()
      return {
        id: activity.id,
        label: node ? node?.term.label : '',
      };
    });

    return nodes;
  }

  createSave() {
    const self = this;
    const saveData = {
      title: '',
      nodes: [],
      triples: [],
      graph: null
    };

    let triples: Triple<ActivityNode>[]

    if (self.predicate.isReverseLink) {
      triples = [new Triple<ActivityNode>(
        self.objectNode, self.subjectNode, self.predicate)
      ]
    } else {
      triples = [new Triple<ActivityNode>(
        self.subjectNode, self.objectNode, self.predicate)
      ]
    }

    saveData.triples = triples;

    return saveData;
  }

  createEdit(srcActivity: ConnectorActivity, predicate?: Predicate) {
    const self = this;

    if (predicate) {
      this.predicate = predicate;
    }

    const srcSaveData = srcActivity.createSave();
    const destSaveData = self.createSave();
    const saveData = {
      removeTriples: srcSaveData.triples,
      addTriples: destSaveData.triples
    };

    return saveData;
  }

  createEditEvidence(srcActivity: ConnectorActivity, predicate: Predicate) {
    const self = this;
    self.predicate.evidence = predicate.evidence;

    const removeTriples = new Triple(self.subjectNode, self.objectNode, srcActivity.predicate);
    const addTriples = new Triple(self.subjectNode, self.objectNode, self.predicate);

    const saveData = {
      addTriples: addTriples,
      removeTriples: removeTriples,
    };

    return saveData;
  }

  createDelete() {
    const self = this;

    const deleteData = {
      triples: []
    };

    if (self.predicate.isReverseLink) {
      deleteData.triples.push(new Triple(self.objectNode, self.subjectNode, self.predicate));
    } else {
      deleteData.triples.push(new Triple(self.subjectNode, self.objectNode, self.predicate));
    }

    return deleteData;
  }

  createGraph(srcEvidence?: Evidence[]) {
    const self = this;
    const evidence = srcEvidence ? srcEvidence : self.predicate.evidence;

    self.addNodes(self.subjectNode, self.objectNode);
    self.addEdge(self.subjectNode, self.objectNode, new Predicate(self.predicate.edge, evidence));
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

    this.predicate.evidence = evidence;

    // this.createGraph(evidence);
  }

  private _getPreviewEdges(): NgxEdge[] {
    const self = this;

    let edges: NgxEdge[] = [];

    edges = <NgxEdge[]>[
      {
        source: self.subject.id,
        target: self.object.id,
        label: self.predicate.edge ? self.predicate.edge.label : ''
      }];

    return edges;
  }
}
