import { Component, OnInit, Input } from '@angular/core';
import * as shape from 'd3-shape';
import { Edge, Node, ClusterNode, Layout } from '@swimlane/ngx-graph';
import { Subject } from 'rxjs';

import { DagreNodesOnlyLayout } from './tree-layout';


@Component({
  selector: 'noc-graph-preview',
  templateUrl: './graph-preview.component.html',
  styleUrls: ['./graph-preview.component.scss']
})
export class GraphPreviewComponent implements OnInit {
  _nodes: Node[];
  _edges: Edge[];

  // @Input('nodes')
  // nodes: Node[];  

  //@Input('edges')
  //edges: Edge[];

  @Input() set nodes(value: Node[]) {
    this._nodes = [...value];
    this.update$.next(true);
  }

  get nodes(): Node[] {
    return this._nodes;
  }

  @Input() set edges(value: Edge[]) {
    this._edges = [...value];
    this.update$.next(true);
  }

  get edges(): Edge[] {
    return this._edges;
  }

  layout: String | Layout = 'dagreCluster';
  layouts: any[] = [
    {
      label: 'Dagre',
      value: 'dagre',
    },
    {
      label: 'Dagre Cluster',
      value: 'dagreCluster',
      isClustered: true,
    },
    {
      label: 'Cola Force Directed',
      value: 'colaForceDirected',
      isClustered: true,
    },
    {
      label: 'D3 Force Directed',
      value: 'd3ForceDirected',
    },
  ];


  // line interpolation
  curveType: string = 'Bundle';
  curve: any = shape.curveLinear;
  interpolationTypes = [
    'Bundle',
    'Cardinal',
    'Catmull Rom',
    'Linear',
    'Monotone X',
    'Monotone Y',
    'Natural',
    'Step',
    'Step After',
    'Step Before'
  ];
  draggingEnabled = false;
  panningEnabled = true;
  zoomEnabled = true;

  zoomSpeed = 0.1;
  minZoomLevel = 0.1;
  maxZoomLevel = 4.0;
  panOnZoom = false;

  autoZoom = true;
  autoCenter = true;

  update$: Subject<boolean> = new Subject();
  center$: Subject<boolean> = new Subject();
  zoomToFit$: Subject<boolean> = new Subject();


  public layoutSettings = {
    orientation: "TB"
  }
  //  public curve: any = shape.curveLinear;
  //public layout: Layout = new DagreNodesOnlyLayout();

  ngOnInit() {
    this.setInterpolationType(this.curveType);
    setTimeout(
      () => {
        window.dispatchEvent(new Event('resize'));
      }, 10);
  }

  setInterpolationType(curveType) {
    this.curveType = curveType;
    if (curveType === 'Bundle') {
      this.curve = shape.curveBundle.beta(1);
    }
    if (curveType === 'Cardinal') {
      this.curve = shape.curveCardinal;
    }
    if (curveType === 'Catmull Rom') {
      this.curve = shape.curveCatmullRom;
    }
    if (curveType === 'Linear') {
      this.curve = shape.curveLinear;
    }
    if (curveType === 'Monotone X') {
      this.curve = shape.curveMonotoneX;
    }
    if (curveType === 'Monotone Y') {
      this.curve = shape.curveMonotoneY;
    }
    if (curveType === 'Natural') {
      this.curve = shape.curveNatural;
    }
    if (curveType === 'Step') {
      this.curve = shape.curveStep;
    }
    if (curveType === 'Step After') {
      this.curve = shape.curveStepAfter;
    }
    if (curveType === 'Step Before') {
      this.curve = shape.curveStepBefore;
    }
  }

  setLayout(layoutName: string): void {
    const layout = this.layouts.find(l => l.value === layoutName);
    // this.layout = layoutName;  
  }

  public getStyles(node: Node): any {
    return {
      "background-color": node.data.backgroundColor,
    }
  }
}

