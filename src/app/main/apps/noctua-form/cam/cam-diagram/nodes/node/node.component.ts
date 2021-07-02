import { Component, Input, OnInit, ElementRef, Renderer2, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { jsPlumb } from 'jsplumb';

import { BehaviorSubject, Subject, Observable, Subscriber } from 'rxjs';
import { NodeService } from './../services/node.service';

import { NoctuaFormDialogService } from './../../../../services/dialog.service';
import { CamDiagramService } from './../../services/cam-diagram.service';
import { NoctuaActivityFormService, NoctuaFormMenuService } from 'noctua-form-base';
import { CamService } from 'noctua-form-base'
import { Activity } from 'noctua-form-base';
import { ActivityNode } from 'noctua-form-base';



@Component({
  selector: 'noc-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NodeComponent implements OnInit, AfterViewInit {

  @Input() activity: Activity;

  onNodeReady: Subject<any> = new Subject();// = new BehaviorSubject({});
  gpTerm;
  connectionId
  connector = new ActivityNode();


  constructor(
    private noctuaFormDialogService: NoctuaFormDialogService,
    private camService: CamService,
    public noctuaFormMenuService: NoctuaFormMenuService,
    public noctuaActivityFormService: NoctuaActivityFormService,
    public camDiagramService: CamDiagramService,
    private elRef: ElementRef,
    private renderer: Renderer2) { }

  ngOnInit() {
    const self = this;

    //  self.onNodeReady = new BehaviorSubject({});
    //  self.camDiagramService.onNodesReady.push(this.onNodeReady)
    self.connectionId = self.activity.id;
    self.gpTerm = self.activity.getGPNode().getTerm();
    self.connector = self.activity.getMFNode();
  }

  ngAfterViewInit() {
    const self = this;

    let nodeEl = this.elRef.nativeElement.children[0]

    // if()


    let location = JSON.parse(localStorage.getItem(self.activity.id));
    if (location) {
      let locationX = location.x + 'px';
      let locationY = location.y + 'px';
      self.renderer.setStyle(nodeEl, 'left', locationX);
      self.renderer.setStyle(nodeEl, 'top', locationY);
    }



    self.camDiagramService.jsPlumbInstance.registerConnectionType("basic", { anchor: "Continuous", connector: "StateMachine" });

    self.initNode(self.connectionId);

    //  console.log(locationX)
    // self.onNodeReady = new BehaviorSubject(self.connectionId)
    self.onNodeReady.next(self.connectionId)

    //var canvas = document.getElementById("canvas");
    // var windows = jsPlumb.getSelector(".statemachine-demo .w");

    // bind a click listener to each connection; the connection is deleted. you could of course
    // just do this: self.nodeService.jsPlumbInstance.bind("click", self.nodeService.jsPlumbInstance.deleteConnection), but I wanted to make it clear what was
    // happening.



  }

  initNode(el) {
    const self = this;
    // initialise draggable elements.
    self.camDiagramService.jsPlumbInstance.draggable(el);

    self.camDiagramService.jsPlumbInstance.makeSource(el, {
      filter: ".noc-connector",
      anchor: "Continuous",
      connectorStyle: { stroke: "#5c96bc", strokeWidth: 2, outlineStroke: "transparent", outlineWidth: 4 },
      connectionType: "basic",
      extract: {
        "action": "the-action"
      },
      // maxConnections: 2,
      onMaxConnections: function (info, e) {
        alert("Maximum connections (" + info.maxConnections + ") reached");
      }
    });

    self.camDiagramService.jsPlumbInstance.makeTarget(el, {
      dropOptions: { hoverClass: "dragHover" },
      anchor: "Continuous",
      allowLoopback: true
    });

    // this is not part of the core demo functionality; it is a means for the Toolkit edition's wrapped
    // version of this demo to find out about new nodes being added.
    //
    // self.nodeService.jsPlumbInstance.fire("jsPlumbDemoNodeAdded", el);
  }

  openActivityForm() {
    this.noctuaActivityFormService.initializeForm(this.activity);
    //this.noctuaFormMenuService.openRightDrawer(this.noctuaFormMenuService.panel.activityForm)
  }

}
