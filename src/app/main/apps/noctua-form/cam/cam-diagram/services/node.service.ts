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
  _jsPlumbInstance
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

  initJsPlumbInstance() {
    const self = this;

    self._jsPlumbInstance = jsPlumb.getInstance({
      Endpoint: ["Dot", <any>{ radius: 2 }],
      Connector: "StateMachine",
      HoverPaintStyle: { stroke: "#1e8151", strokeWidth: 2 },
      ConnectionOverlays: [
        ["Arrow", {
          location: 1,
          id: "arrow",
          length: 14,
          foldback: 0.8
        }],
        ["Label", { label: "FOO", id: "label", cssClass: "aLabel" }]
      ],
      Container: "canvas"
    });
  }

  get jsPlumbInstance() {
    const self = this;

    if (!this._jsPlumbInstance) {
      self.initJsPlumbInstance()
    }
    return this._jsPlumbInstance;
  }
}
