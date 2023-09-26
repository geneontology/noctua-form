import { ActivityNode } from './activity-node';
import { Entity } from './entity';
import { noctuaFormConfig } from './../../noctua-form-config';
import { Activity } from './activity';
import { Triple } from './triple';
import { Predicate } from './predicate';
import * as EntityDefinition from './../../data/config/entity-definition';


export class AnnotationActivity {
  gp: ActivityNode;
  goterm: ActivityNode;
  extension: ActivityNode;
  gpToTermEdge: Entity;
  extensionEdge: Entity;
  extensionType;
  gotermAspect: string;

  gpToTermEdges: Entity[] = [];
  extensionEdges: Entity[] = [];


  constructor(activity: Activity) {
    this.activityToAnnotation(activity)
  }


  activityToAnnotation(activity: Activity) {
    this.gp = activity.getNode('gp');
    this.goterm = activity.getNode('goterm');
    this.extension = activity.getNode('extension');

  }

  createSave() {
    const self = this;
    const saveData = {
      title: 'enabled by ' + self.gp?.term.label,
      triples: [],
      nodes: [self.gp, self.goterm],
      graph: null
    };

    if (this.gpToTermEdge.id === noctuaFormConfig.inverseEdge.enables.id) {
      const gpToTermTriple = new Triple(self.goterm, self.gp,
        new Predicate(Entity.createEntity(noctuaFormConfig.edge.enabledBy), self.goterm.predicate.evidence));

      saveData.triples.push(gpToTermTriple);

    } else if (this.gpToTermEdge.id === noctuaFormConfig.inverseEdge.involvedIn.id) {
      const mfNode = EntityDefinition.generateBaseTerm([]);
      const rootMF = noctuaFormConfig.rootNode.mf;

      mfNode.term = new Entity(rootMF.id, rootMF.label);

      const mfToGpTriple = new Triple(mfNode, self.gp,
        new Predicate(Entity.createEntity(noctuaFormConfig.edge.enabledBy), self.goterm.predicate.evidence));

      const mfToTermTriple = new Triple(mfNode, self.goterm,
        new Predicate(Entity.createEntity(noctuaFormConfig.edge.partOf), self.goterm.predicate.evidence));

      saveData.triples.push(mfToGpTriple);
      saveData.triples.push(mfToTermTriple);

    } else if (this.gpToTermEdge.id === noctuaFormConfig.inverseEdge.isActiveIn.id) {
      const mfNode = EntityDefinition.generateBaseTerm([]);
      const rootMF = noctuaFormConfig.rootNode.mf;

      mfNode.term = new Entity(rootMF.id, rootMF.label);

      const mfToGpTriple = new Triple(mfNode, self.gp,
        new Predicate(Entity.createEntity(noctuaFormConfig.edge.enabledBy), self.goterm.predicate.evidence));

      const mfToTermTriple = new Triple(mfNode, self.goterm,
        new Predicate(Entity.createEntity(noctuaFormConfig.edge.occursIn), self.goterm.predicate.evidence));

      saveData.triples.push(mfToGpTriple);
      saveData.triples.push(mfToTermTriple);

    }




    if (self.extension?.hasValue()) {
      const extensionTriple = new Triple(self.goterm, self.extension,
        new Predicate(this.extensionEdge, self.goterm.predicate.evidence));

      saveData.nodes.push(self.extension);
      saveData.triples.push(extensionTriple);
    }

    return saveData;
  }


  updateAspect() {
    if (!this.goterm.hasValue()) return

    let aspect: string | null = null;
    const rootNode = noctuaFormConfig.rootNode
    for (const key in noctuaFormConfig.rootNode) {
      if (this.goterm.rootTypes && this.goterm.rootTypes.some(item => item.id === rootNode[key].id)) {
        this.gotermAspect = rootNode[key].aspect;
        break;
      }
    }

    return aspect;
  }

}
