import {
  ComponentRef,
  ComponentFactoryResolver,
  Injectable,
  Inject,
  ReflectiveInjector
} from '@angular/core';

import { CamDiagramService } from './../../services/cam-diagram.service';

import { Activity } from 'noctua-form-base';
import { NodeComponent } from './../node/node.component';
import { jsPlumb } from 'jsplumb';

@Injectable({
  providedIn: 'root'
})
export class NodeService {
  private rootViewContainer: any;

  constructor(private factoryResolver: ComponentFactoryResolver,
    public camDiagramService: CamDiagramService) { }

  public setRootViewContainerRef(viewContainerRef) {
    this.rootViewContainer = viewContainerRef;
  }

  public addDynamicNode(activity: Activity) {
    const self = this;

    const factory = this.factoryResolver.resolveComponentFactory(NodeComponent);
    const component = factory.create(self.rootViewContainer.parentInjector);
    const nodeComponent: NodeComponent = <NodeComponent>component.instance

    nodeComponent.activity = activity;
    self.rootViewContainer.insert(component.hostView);
    self.camDiagramService.onNodesReady.push(nodeComponent.onNodeReady)

    return component;
  }

  public clear() {
    this.rootViewContainer.clear();
  }
}
