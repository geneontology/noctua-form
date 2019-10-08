
import { AnnotonNode, AnnotonNodeType } from './annoton-node';
import { Triple } from './triple';
import { Evidence } from './evidence';
import { Predicate } from './predicate';

import {
  Graph,
  Edge,
  addNode,
  removeNode,
  removeEdge,
  addEdge,
  findEdge,
  findNode,
  getNodes,
  getEdges,
} from './noctua-form-graph';
import { each, find } from 'lodash';

export class SaeGraph<T extends AnnotonNode> {
  numberOfEdges: number;
  graph: Graph<T, Triple<T>>;

  constructor() {
    this.graph = <Graph<T, Triple<T>>>{ _nodes: {}, _edges: {} };
  }

  get nodes(): T[] {
    const keyNodes = getNodes(this.graph);

    return Object.values(keyNodes);
  }

  get edges(): Triple<T>[] {
    return this.getEdges(null);
  }

  getNode(id: string): T {
    return findNode(this.graph, id);
  }

  addNode(node: T) {
    return addNode(this.graph, node, node.id);
  }

  addNodes(...nodes: T[]) {
    const self = this;

    nodes.forEach((node: T) => {
      self.addNode(node);
    });
  }

  removeNode(node: T) {
    removeNode(this.graph, node.id);
  }

  addEdge(subjectNode: T, objectNode: T, predicate: Predicate) {

    const triple = new Triple(subjectNode, predicate, objectNode);
    const edge: Edge<Triple<T>> = { subjectId: subjectNode.id, objectId: objectNode.id, metadata: triple }

    addEdge(this.graph, edge);
  }

  addEdgeById(sourceId: string, objectId: string, predicate: Predicate) {
    const source = this.getNode(sourceId);
    const object = this.getNode(objectId);

    this.addEdge(source, object, predicate);
  }

  editEdge(subjectId, objectId, srcEdge) {
    const destEdge = this.getEdge(subjectId, objectId);

    // destEdge.edge = srcEdge;
  }

  getEdge(subjectId: string, objectId: string): Triple<T> {
    const srcEdge: Edge<Triple<T>> = { subjectId: subjectId, objectId: objectId, metadata: null };
    const destEdge = findEdge(this.graph, srcEdge);

    return destEdge ? destEdge.metadata : null;
  }

  getEdges(id: string): Triple<T>[] {
    const edges: Edge<Triple<T>>[] = getEdges(this.graph, id);

    return edges.map((edge: Edge<Triple<T>>) => {
      return edge.metadata;
    });
  }

  removeEdge(subjectNode: T, objectNode: T, predicate: Predicate) {

    const triple = new Triple(subjectNode, predicate, objectNode);
    const edge: Edge<Triple<T>> = { subjectId: subjectNode.id, objectId: objectNode.id, metadata: triple };

    removeEdge(this.graph, edge);
  }

  getTrimmedGraph(startNodeId: string): Graph<T, Triple<T>> {
    const self = this;
    const graph = <Graph<T, Triple<T>>>{ _nodes: {}, _edges: {} };
    const startingEdges = self.getEdges(startNodeId);
    const startingNode = self.getNode(startNodeId);

    addNode(graph, startingNode, startingNode.id);

    each(startingEdges, (triple: Triple<T>) => {
      self._trimGraphDFS(graph, triple.subject, triple.object, triple.predicate, triple.predicate);
    });

    return graph;
  }

  edgeTypeExist(
    id: string,
    edgeId: string,
    subjectType: AnnotonNodeType,
    objectType: AnnotonNodeType) {
    const self = this;
    const result = find(self.getEdges(id), (triple: Triple<T>) => {
      return triple.predicate.edge.id === edgeId &&
        triple.subject.type === subjectType &&
        triple.object.type === objectType;
    });

    return result;
  }

  resetGraph() {
    this.graph = this.graph = <Graph<T, Triple<T>>>{ _nodes: {}, _edges: {} };
  }

  private _trimGraphDFS(graph: Graph<T, Triple<T>>,
    subjectNode: T,
    objectNode: T,
    subjectPredicate: Predicate,
    objectPredicate: Predicate) {
    const self = this;
    if (objectNode.hasValue()) {
      const destPredicate = new Predicate(subjectPredicate.edge, objectPredicate.evidence);
      const triple = new Triple(subjectNode, destPredicate, objectNode);
      const edge: Edge<Triple<T>> = { subjectId: subjectNode.id, objectId: objectNode.id, metadata: triple };

      addNode(graph, objectNode, objectNode.id);
      addEdge(graph, edge);
    }

    each(self.getEdges(objectNode.id), (triple: Triple<T>) => {
      self._trimGraphDFS(graph,
        objectNode.hasValue() ? objectNode : subjectNode,
        triple.object,
        objectNode.hasValue() ? triple.predicate : subjectPredicate,
        triple.predicate);
    });
  }
}
