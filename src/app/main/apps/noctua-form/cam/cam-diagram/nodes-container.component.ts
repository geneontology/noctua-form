import { Component, OnChanges, AfterViewInit, Input, ViewEncapsulation, ChangeDetectionStrategy, ViewContainerRef, ViewChild } from '@angular/core';
import { NodeService } from './node.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'noc-nodes-container',
  templateUrl: './nodes-container.component.html',
  styleUrls: ['./nodes-container.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodesContainerComponent implements OnChanges, AfterViewInit {
  @ViewChild('nodes', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;
  @Input() nodes: any[];


  constructor(private nodeService: NodeService) { }

  ngOnChanges() {
    this.nodeService.setRootViewContainerRef(this.viewContainerRef);
    this.nodeService.clear();
    if (this.nodes.length > 0) {
      this.nodes.forEach(node => {
        this.nodeService.addDynamicNode(node);
      })
      this.foo()
    }
  }


  ngAfterViewInit() {
    this.nodeService.initJsPlumbInstance();
    //  this.nodeService.jsPlumbInstance.setZoom(0.25);
    this.foo()
  }

  foo() {
    const self = this;

    self.nodeService.jsPlumbInstance.batch(function () {
      self.nodes.forEach(node => {
        let connections = node.annoton.annotonConnections;

        connections.forEach(connection => {
          self.nodeService.jsPlumbInstance.connect({
            source: node.annoton.connectionId,
            target: connection.object.modelId,
            type: "basic"
          });
        });
      });
    })
  }
}
