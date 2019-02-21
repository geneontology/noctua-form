import { Component, Input, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { jsPlumb } from 'jsplumb';
import { NodeService } from './../node.service';

import { Annoton } from '@noctua.form/models/annoton/annoton';

@Component({
  selector: 'noc-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NodeComponent implements OnInit, AfterViewInit {

  @Input() annoton: Annoton;

  connectionId


  constructor(private nodeService: NodeService) { }

  ngOnInit() {
    const self = this;
    self.connectionId = self.annoton.connectionId
  }

  ngAfterViewInit() {
    const self = this;



    console.log(this.annoton);





    self.nodeService.jsPlumbInstance.registerConnectionType("basic", { anchor: "Continuous", connector: "StateMachine" });

    self.initNode(self.connectionId);

    var canvas = document.getElementById("canvas");
    // var windows = jsPlumb.getSelector(".statemachine-demo .w");

    // bind a click listener to each connection; the connection is deleted. you could of course
    // just do this: self.nodeService.jsPlumbInstance.bind("click", self.nodeService.jsPlumbInstance.deleteConnection), but I wanted to make it clear what was
    // happening.
    self.nodeService.jsPlumbInstance.bind("click", function (c) {
      self.nodeService.jsPlumbInstance.deleteConnection(c);
    });

    // bind a connection listener. note that the parameter passed to this function contains more than
    // just the new connection - see the documentation for a full list of what is included in 'info'.
    // this listener sets the connection's internal
    // id as the label overlay's text.
    self.nodeService.jsPlumbInstance.bind("connection", function (info) {
      info.connection.getOverlay("label").setLabel(info.connection.id);
    });

    // bind a double click listener to "canvas"; add new node when this occurs.


    //
    // initialise element as connection targets and source.
    //


    // suspend drawing and initialise.
    self.nodeService.jsPlumbInstance.batch(function () {
      //   for (var i = 0; i < windows.length; i++) {
      //        initNode(windows[i], true);
      //    }
      // and finally, make a few connections
      //  self.nodeService.jsPlumbInstance.connect({ source: "opened", target: "phone1", type:"basic" });
      // self.nodeService.jsPlumbInstance.connect({ source: "phone1", target: "phone1", type:"basic" });
      // self.nodeService.jsPlumbInstance.connect({ source: "phone1", target: "inperson", type:"basic" });

      // self.nodeService.jsPlumbInstance.connect({
      //     source:"phone2",
      //     target:"rejected",
      //      type:"basic"
      //   });
    });
  }

  initNode(el) {
    const self = this;
    // initialise draggable elements.
    self.nodeService.jsPlumbInstance.draggable(el);

    self.nodeService.jsPlumbInstance.makeSource(el, {
      filter: ".ep",
      anchor: "Continuous",
      connectorStyle: { stroke: "#5c96bc", strokeWidth: 2, outlineStroke: "transparent", outlineWidth: 4 },
      connectionType: "basic",
      extract: {
        "action": "the-action"
      },
      maxConnections: 2,
      onMaxConnections: function (info, e) {
        alert("Maximum connections (" + info.maxConnections + ") reached");
      }
    });

    self.nodeService.jsPlumbInstance.makeTarget(el, {
      dropOptions: { hoverClass: "dragHover" },
      anchor: "Continuous",
      allowLoopback: true
    });

    // this is not part of the core demo functionality; it is a means for the Toolkit edition's wrapped
    // version of this demo to find out about new nodes being added.
    //
    // self.nodeService.jsPlumbInstance.fire("jsPlumbDemoNodeAdded", el);
  };
}
