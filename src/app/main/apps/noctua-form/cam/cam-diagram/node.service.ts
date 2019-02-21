import {
  ComponentRef,
  ComponentFactoryResolver,
  Injectable,
  Inject,
  ReflectiveInjector
} from '@angular/core';

import { NodeComponent } from './node/node.component';

@Injectable()
export class NodeService {

  private rootViewContainer: any;

  constructor(private factoryResolver: ComponentFactoryResolver) { }

  public setRootViewContainerRef(viewContainerRef) {
    this.rootViewContainer = viewContainerRef;
  }

  public addDynamicNode(nodeName: string) {
    const factory = this.factoryResolver.resolveComponentFactory(NodeComponent);
    const component = factory.create(this.rootViewContainer.parentInjector);
    (<any>component.instance).id = nodeName;

    this.rootViewContainer.insert(component.hostView);
  }

  public clear() {
    this.rootViewContainer.clear();
  }
}

