//
import { noctuaFormConfig } from './../../../noctua-form-config';

import { AnnotonError } from './annoton-error';
import { AnnotonNode } from '../annoton-node';
import { each, includes, find } from 'lodash';

export class AnnotonParser {
  rules;
  errors;
  warnings;
  clean: boolean;
  noctuaFormConfig

  constructor() {
    this.rules = [];
    this.errors = [];
    this.warnings = [];
    this.clean = true;
  }

  parseCardinality(graph, node: AnnotonNode, sourceEdges) {
    const self = this;

    const edges = [];
    let result = true;
    let error;

    each(sourceEdges, function (edge) {
      const predicateId = edge.predicate_id();
      const predicateLabel = self.getPredicateLabel(predicateId);

      if (includes(noctuaFormConfig.noDuplicateEdges, predicateId)) {
        if (includes(edges, predicateId)) {
          let meta = {
            aspect: node.label,
            subjectNode: {
              label: node.term.label
            },
            edge: {
              label: predicateLabel
            },
            objectNode: {
              label: self.getNodeLabel(graph, edge.object_id())
            },
          }
          error = new AnnotonError('warning', 3, "More than 1 " + predicateLabel + " found", meta)
          self.errors.push(error);
          node.errors.push(error);
          self.warnings.push(error);
          node.warnings.push(error);
          result = false;
        } else {
          edges.push(predicateId);
        }
      }
    });

    self.clean = self.clean && result;
    return result;
  }

  getPredicateLabel(id) {
    const self = this;
    let predicate = find(noctuaFormConfig.edge, function (val) {
      return val.id === id;
    });
    return predicate ? predicate.label : id;
  }

  parseNodeOntology(node: AnnotonNode) {
    const self = this;
    let result = true;
    let error;

    if (!includes(node.closures, node.category)) {
      let meta = {
        aspect: node.label,
        subjectNode: {
          label: node.label
        }
      }
      error = new AnnotonError('error', 4, "Wrong ontology class. Expected " + JSON.stringify(node.category), meta);
      self.errors.push(error);
      node.errors.push(error);
      result = false;
    }

    self.clean = self.clean && result;
    return result;
  }

  parseNodeOntologyAll(node: AnnotonNode, ontologyId) {
    const self = this;
    let result = true;
    let error;
    let prefix = ontologyId.split(":")[0].toLowerCase();

    each(node.ontologyClass, function (ontologyClass) {
      if (ontologyClass !== prefix) {
        let meta = {
          aspect: node.label,
          subjectNode: {
            label: node.term.label
          }
        }
        error = new AnnotonError('error', 4, "Wrong ontology class " + prefix + ". Expected " + JSON.stringify(node.ontologyClass), meta);
        self.errors.push(error);
        node.errors.push(error);
        result = false;
      }
    });

    self.clean = self.clean && result;
    return result;
  }

  setCardinalityError(subjectNode: AnnotonNode, objectNodeTerm, predicateId) {
    const self = this;
    let result = true;
    let meta = {
      aspect: '',
      subjectNode: {
        label: subjectNode.term.label
      },
      edge: {
        label: self.getPredicateLabel(predicateId)
      },
      objectNode: {
        label: objectNodeTerm.label
      },
    }
    let error = new AnnotonError('error', 2, "Incorrect relationship between " +
      meta.subjectNode.label + ' and ' + meta.objectNode.label, meta);

    self.errors.push(error);
    subjectNode.errors.push(error);

    self.clean = false;
  }

  setNodeOntologyError(node: AnnotonNode) {
    const self = this;
    let result = true;
    let meta = {
      aspect: node.label,
      subjectNode: {
        label: node.term.label
      }
    }
    let error = new AnnotonError('error', 4, "Incorrect association between term and relationship" + JSON.stringify(node.category), meta);
    self.errors.push(error);
    node.errors.push(error);

    self.clean = false;
  }

  setNodeWarning(node) {
    const self = this;
    let result = true;
    let meta = {
      aspect: '',
      subjectNode: {
        label: node.term.label
      }
    }
    let error = new AnnotonError('warning', 1, "There was an error above ", meta);
    self.errors.push(error);
    node.errors.push(error);

    self.warnings.push(error);
    node.warnings.push(error);

    self.clean = false;
  }

  printErrors() {
    const self = this;
    console.log(self.errors);
  }

  allowedEdge(predicateId) {
    const self = this;
    return find(noctuaFormConfig.causalEdges, function (edge) {
      return edge.id === predicateId
    });
  }

  parseCardinalityTemp(graph, node: AnnotonNode, sourceEdges, objectEdges) {
    const self = this;

    let edges2 = [];
    let result = true;
    let error;

    each(sourceEdges, function (edge) {
      let predicateId = edge.predicate_id();
      let predicateLabel = self.getPredicateLabel(predicateId);
      let allowedEdge = self.allowedEdge(predicateId);

      if (!allowedEdge) {
        if (includes(edges2, predicateId)) {
          let meta = {
            aspect: node.label,
            subjectNode: {
              label: node.term.label
            },
            edge: {
              label: predicateLabel
            },
            objectNode: {
              label: self.getNodeLabel(graph, edge.object_id())
            },
          }
          error = new AnnotonError('warning', 3, "More than 1 " + predicateLabel + " found.", meta)
          self.errors.push(error);

          result = false;
        }

        let v = find(objectEdges, function (node) {
          return node.edge.id === predicateId
        });

        if (v) {
          if (!self.canDuplicateEdge(predicateId)) {
            edges2.push(predicateId);
          }
        } else {
          let meta = {
            aspect: node.label,
            subjectNode: {
              label: node.term.label
            },
            edge: {
              label: predicateLabel
            },
            objectNode: {
              label: self.getNodeLabel(graph, edge.object_id())
            },
          }
          error = new AnnotonError('error', 2, "Not accepted triple ", meta);
          self.errors.push(error);
          node.errors.push(error);
          result = false;
        }
      }
    });

    self.clean = self.clean && result;
    return result;
  }

  canDuplicateEdge(predicateId) {
    const self = this;
    return find(noctuaFormConfig.canDuplicateEdges, function (edge) {
      return edge.id === predicateId
    });
  }

  getNodeLabel(graph, object) {
    const self = this;
    let label = '';
    let node = graph.get_node(object);

    if (node) {
      each(node.types(), function (in_type) {

        let type;
        if (in_type.type() === 'complement') {
          type = in_type.complement_class_expression();
        } else {
          type = in_type;
        }

        label += type.class_label() +
          ' (' + type.class_id() + ')';
      });
    }

    return label;
  }
}