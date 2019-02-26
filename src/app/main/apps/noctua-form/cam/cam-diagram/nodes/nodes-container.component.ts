import { Component, OnChanges, AfterViewInit, Input, ViewEncapsulation, ChangeDetectionStrategy, ViewContainerRef, ViewChild } from '@angular/core';
import { MatDrawer, MatMenuTrigger } from '@angular/material';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { NodeService } from './services/node.service';
import { CamDiagramService } from './../services/cam-diagram.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NoctuaFormGridService } from '@noctua.form/services/form-grid.service';
import { CamService } from '@noctua.form/services/cam.service'
import { Annoton } from '@noctua.form/models/annoton/annoton';
import { AnnotonNode } from '@noctua.form/models/annoton/annoton-node';

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
  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;

  constructor(
    public camDiagramService: CamDiagramService,
    private noctuaFormGridService: NoctuaFormGridService,
    private nodeService: NodeService) { }

  addActivity(event) {
    console.log(event.clientX + 'px');
    console.log(event.clientY + 'px');

    this.openForm();
  }

  openForm() {
    this.noctuaFormGridService.initalizeForm();
    this.camDiagramService.openRightDrawer(this.camDiagramService.panel.camForm.id)
  }


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
    this.camDiagramService.initJsPlumbInstance();
    //  this.nodeService.jsPlumbInstance.setZoom(0.25);
    this.foo()
  }

  foo() {
    const self = this;

    self.camDiagramService.jsPlumbInstance.batch(function () {
      self.nodes.forEach((annoton: Annoton) => {
        let connections = annoton.annotonConnections;

        connections.forEach(connection => {
          self.camDiagramService.jsPlumbInstance.connect({
            source: annoton.connectionId,
            target: connection.object.modelId,
            type: "basic"
          });
        });
      });
    })
  }
}
