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
    const self = this;
    self.jsPlumbInstance = jsPlumb.getInstance({
      // default drag options
      DragOptions: { cursor: 'pointer', zIndex: 2000 },
      // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in self
      // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
      ConnectionOverlays: [
        ["Arrow", {
          location: 1,
          visible: true,
          width: 11,
          length: 11,
          id: "ARROW",
          events: {
            click: function () { alert("you clicked on the arrow overlay") }
          }
        }],
        ["Label", {
          location: 0.1,
          id: "label",
          cssClass: "aLabel",
          events: {
            tap: function () { alert("hey"); }
          }
        }]
      ],
      Container: "cam-canvas"
    });


    self.jsPlumbInstance.draggable(self.id, {
      containment: true
    });
    var endpointOptions = { isSource: true, isTarget: true };

    var basicType = {
      connector: "StateMachine",
      paintStyle: { stroke: "red", strokeWidth: 4 },
      hoverPaintStyle: { stroke: "blue" },
      overlays: [
        "Arrow"
      ]
    };
    self.jsPlumbInstance.registerConnectionType("basic", basicType);

    // self is the paint style for the connecting lines..
    var connectorPaintStyle = {
      strokeWidth: 2,
      stroke: "#61B7CF",
      joinstyle: "round",
      outlineStroke: "white",
      outlineWidth: 2
    },
      // .. and self is the hover style.
      connectorHoverStyle = {
        strokeWidth: 3,
        stroke: "#216477",
        outlineWidth: 5,
        outlineStroke: "white"
      },
      endpointHoverStyle = {
        fill: "#216477",
        stroke: "#216477"
      },
      // the definition of source endpoints (the small blue ones)
      sourceEndpoint = {
        endpoint: "Dot",
        paintStyle: {
          stroke: "#7AB02C",
          fill: "transparent",
          radius: 7,
          strokeWidth: 1
        },
        isSource: true,
        connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],
        connectorStyle: connectorPaintStyle,
        hoverPaintStyle: endpointHoverStyle,
        connectorHoverStyle: connectorHoverStyle,
        dragOptions: {},
        overlays: [
          ["Label", {
            location: [0.5, 1.5],
            label: "Drag",
            cssClass: "endpointSourceLabel",
            visible: false
          }]
        ]
      },
      // the definition of target endpoints (will appear when the user drags a connection)
      targetEndpoint = {
        endpoint: "Dot",
        paintStyle: { fill: "#7AB02C", radius: 7 },
        hoverPaintStyle: endpointHoverStyle,
        maxConnections: -1,
        dropOptions: { hoverClass: "hover", activeClass: "active" },
        isTarget: true,
        overlays: [
          ["Label", { location: [0.5, -0.5], label: "Drop", cssClass: "endpointTargetLabel", visible: false }]
        ]
      },
      init = function (connection) {
        connection.getOverlay("label").setLabel(connection.sourceId.substring(15) + "-" + connection.targetId.substring(15));
      };

    var _addEndpoints = function (toId, sourceAnchors, targetAnchors) {
      for (var i = 0; i < sourceAnchors.length; i++) {
        var sourceUUID = toId + sourceAnchors[i];
        self.jsPlumbInstance.addEndpoint(toId, sourceEndpoint, {
          anchor: sourceAnchors[i], uuid: sourceUUID
        });
      }
      for (var j = 0; j < targetAnchors.length; j++) {
        var targetUUID = toId + targetAnchors[j];
        self.jsPlumbInstance.addEndpoint(toId, targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID });
      }
    };

    // suspend drawing and initialise.
    self.jsPlumbInstance.batch(function () {

      _addEndpoints(self.id, ["TopCenter", "BottomCenter"], ["LeftMiddle", "RightMiddle"]);

      // listen for new connections; initialise them the same way we initialise the connections at startup.
      self.jsPlumbInstance.bind("connection", function (connInfo, originalEvent) {
        init(connInfo.connection);
      });

      // make all the window divs draggable
      // self.jsPlumbInstance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [20, 20] });
      // THIS DEMO ONLY USES getSelector FOR CONVENIENCE. Use your library's appropriate selector
      // method, or document.querySelectorAll:
      //jsPlumb.draggable(document.querySelectorAll(".window"), { grid: [20, 20] });

      // connect a few up
      // self.jsPlumbInstance.connect({ uuids: ["Window2BottomCenter", "Window3TopCenter"] });
      //

      //
      // listen for clicks on connections, and offer to delete connections on click.
      //
      self.jsPlumbInstance.bind("click", function (conn, originalEvent) {
        // if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
        //   self.jsPlumbInstance.detach(conn);
        conn.toggleType("basic");
      });

      self.jsPlumbInstance.bind("connectionDrag", function (connection) {
        console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
      });

      self.jsPlumbInstance.bind("connectionDragStop", function (connection) {
        console.log("connection " + connection.id + " was dragged");
      });

      self.jsPlumbInstance.bind("connectionMoved", function (params) {
        console.log("connection " + params.connection.id + " was moved");
      });
    });




    console.log(self.id)
  }
}
