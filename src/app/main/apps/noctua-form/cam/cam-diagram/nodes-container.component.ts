import { Component, OnChanges, Input, ChangeDetectionStrategy, ViewContainerRef, ViewChild } from '@angular/core';
import { NodeService } from './node.service';

@Component({
  selector: 'noc-nodes-container',
  templateUrl: './nodes-container.component.html',
  styleUrls: ['./nodes-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodesContainerComponent implements OnChanges {
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
    }
  }

}
