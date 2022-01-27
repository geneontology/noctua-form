import { Component, OnInit, Input } from '@angular/core';
import { NodeCellType } from '@noctua.graph/models/shapes';
import { NodeCellList, NodeCellMolecule, NodeLink, StencilNode } from '@noctua.graph/services/shapes.service';
import * as joint from 'jointjs';
import { each, cloneDeep } from 'lodash';
import { StencilItemNode } from '@noctua.graph/data/cam-stencil';
import { getEdgeColor } from '@noctua.graph/data/edge-display';

@Component({
  selector: 'noc-relation-preview',
  templateUrl: './relation-preview.component.html',
  styleUrls: ['./relation-preview.component.scss']
})
export class RelationPreviewComponent implements OnInit {

  canvasPaper: joint.dia.Paper;

  @Input('graph')
  canvasGraph: joint.dia.Graph

  constructor() {
    this._initializeCanvas()
  }

  ngOnInit(): void {
  }

  private _initializeCanvas() {
    const self = this;
    self.canvasGraph = new joint.dia.Graph({}, { cellNamespace: joint.shapes });
    self.canvasPaper = new joint.dia.Paper({
      cellViewNamespace: joint.shapes,
      el: document.getElementById('noc-relation-preview-paper'),
      height: '100%',
      width: '100%',
      model: this.canvasGraph,
      restrictTranslate: true,
      multiLinks: false,
      markAvailable: true,
      validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
        if (cellViewS === cellViewT) return false;
        return true;
      },
      validateMagnet: function (cellView, magnet) {
        return true;
      },

      defaultConnectionPoint: { name: 'boundary', args: { sticky: true } },

      defaultConnector: { name: 'smooth' },
      async: true,
      interactive: { labelMove: false },
      linkPinning: false,
      // frozen: true,
      gridSize: 10,
      drawGrid: {
        name: 'doubleMesh',
        args: [
          { color: '#DDDDDD', thickness: 1 }, // settings for the primary mesh
          { color: '#DDDDDD', scaleFactor: 5, thickness: 4 } //settings for the secondary mesh
        ]
      },
      sorting: joint.dia.Paper.sorting.APPROX,
      // markAvailable: true,
      defaultLink: function () {
        return NodeLink.create();
      },
      perpendicularLinks: false,

    });

  }



}
