import { Component, Input, AfterViewInit } from '@angular/core';
import { jsPlumb } from 'jsplumb';
@Component({
  selector: 'noc-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements AfterViewInit {

  @Input() id: string;
  jsPlumbInstance;

  ngAfterViewInit() {
    this.jsPlumbInstance = jsPlumb.getInstance();
    this.jsPlumbInstance.draggable(this.id);

    console.log(this.id)
  }
}
