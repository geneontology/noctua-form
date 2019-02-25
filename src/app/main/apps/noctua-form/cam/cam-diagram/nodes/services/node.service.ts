import {
  ComponentRef,
  ComponentFactoryResolver,
  Injectable,
  Inject,
  ReflectiveInjector
} from '@angular/core';

import { NodeComponent } from './../node/node.component';
import { jsPlumb } from 'jsplumb';

@Injectable()
export class NodeService {
  private rootViewContainer: any;

  constructor(private factoryResolver: ComponentFactoryResolver) { }

  public setRootViewContainerRef(viewContainerRef) {
    this.rootViewContainer = viewContainerRef;
  }

  public addDynamicNode(annotonContainer) {
    const factory = this.factoryResolver.resolveComponentFactory(NodeComponent);
    const component = factory.create(this.rootViewContainer.parentInjector);
    (<any>component.instance).gp = annotonContainer.gp;
    (<any>component.instance).annoton = annotonContainer.annoton;

    this.rootViewContainer.insert(component.hostView);
  }

  public clear() {
    this.rootViewContainer.clear();
  }
}
