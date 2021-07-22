import { Injectable } from '@angular/core';
import 'jqueryui';
import * as joint from 'jointjs';
import { each } from 'lodash';
import { CamCanvas } from '../models/cam-canvas';
import { CamStencil } from '../models/cam-stencil';
import { NoctuaCommonMenuService } from '@noctua.common/services/noctua-common-menu.service';
import { NoctuaDataService } from '@noctua.common/services/noctua-data.service';
import { Activity, Cam, CamService, ConnectorPanel, FormType, NoctuaActivityConnectorService, NoctuaActivityFormService, NoctuaFormConfigService, NoctuaGraphService } from 'noctua-form-base';
import { NodeLink, NodeCellList, NoctuaShapesService } from '@noctua.graph/services/shapes.service';
import { NodeType } from 'scard-graph-ts';
import { NodeCellType } from '@noctua.graph/models/shapes';
import { noctuaStencil, StencilItemNode } from '@noctua.graph/data/cam-stencil';
import { RightPanel } from '@noctua.common/models/menu-panels';
import { NoctuaFormDialogService } from 'app/main/apps/noctua-form';

@Injectable({
  providedIn: 'root'
})
export class CamGraphService {
  cam: Cam;
  stencils: {
    id: string,
    paper: joint.dia.Paper;
    graph: joint.dia.Graph;
  }[] = [];


  selectedElement: joint.shapes.noctua.NodeCellList | joint.shapes.noctua.NodeLink;
  selectedStencilElement: joint.shapes.noctua.NodeCellList;

  placeholderElement: joint.shapes.noctua.NodeCellList = new NodeCellList();

  camCanvas: CamCanvas;
  camStencil: CamStencil;

  constructor(
    private _camService: CamService,
    private _noctuaGraphService: NoctuaGraphService,
    private noctuaFormDialogService: NoctuaFormDialogService,
    private noctuaDataService: NoctuaDataService,
    private noctuaFormConfigService: NoctuaFormConfigService,
    private _activityFormService: NoctuaActivityFormService,
    private _activityConnectorService: NoctuaActivityConnectorService,
    public noctuaCommonMenuService: NoctuaCommonMenuService,
    private noctuaShapesService: NoctuaShapesService) {

    const self = this;

    this._camService.onCamChanged
      .subscribe((cam: Cam) => {
        if (!cam || !self.selectedElement) {
          return;
        }

        const type = self.selectedElement.get('type');

        if (type === NodeCellType.link) {
          (self.selectedElement as NodeLink).setText(cam.title);
        } else {
          self.selectedElement.attr('noctuaTitle/text', cam.title);
          // (self.selectedElement as NodeCell).addColor(cam.backgroundColor);
        }
        self.selectedElement.set({ cam: cam });
        self.selectedElement.set({ id: cam.id });
      });
  }

  initializeGraph() {
    const self = this;

    self.camCanvas = new CamCanvas();
    self.camCanvas.elementOnClick = self.openTable.bind(self);
    self.camCanvas.editOnClick = self.editActivity.bind(self);
    self.camCanvas.linkOnClick = self.openConnector.bind(self);
    self.camCanvas.onLinkCreated = self.createActivityConnector.bind(self);
    self.camCanvas.onUpdateCamLocations = self.updateCamLocations.bind(self);

  }

  initializeStencils() {
    const self = this;

    self.camStencil = new CamStencil(self.camCanvas, noctuaStencil.camStencil);
    self.camStencil.onAddElement = self.createActivity.bind(self);
  }

  addToCanvas(cam: Cam) {
    this.cam = cam;
    this.camCanvas.addCanvasGraph(cam);
  }

  zoom(delta: number, e?) {
    this.camCanvas.zoom(delta, e);
  }

  reset() {
    this.camCanvas.resetZoom();
  }

  updateCamLocations(cam: Cam) {
    this._noctuaGraphService.setActivityLocations(cam);
  }

  createActivity(element: joint.shapes.noctua.NodeCellList, x: number, y: number) {
    const self = this;
    const node = element.get('node') as StencilItemNode;

    self.placeholderElement.position(x, y);
    self._activityFormService.setActivityType(node.type)
    self.noctuaFormDialogService.openCreateActivityDialog(FormType.ACTIVITY);
  }

  createActivityConnector(
    sourceId: string,
    targetId: string,
    link: joint.shapes.noctua.NodeLink) {
    const self = this;

    self._activityConnectorService.initializeForm(sourceId, targetId);
    self._activityConnectorService.selectPanel(ConnectorPanel.FORM)
    self.noctuaFormDialogService.openCreateActivityDialog(FormType.ACTIVITY_CONNECTOR);
  }

  addActivity(activity: Activity) {
    const self = this;

    const el = self.camCanvas.createNode(activity)
    const position = self.placeholderElement.prop('position') as joint.dia.Point

    el.position(position.x, position.y);
    self.camCanvas.canvasGraph.addCell(el);
    self.updateCamLocations(self.cam);
  }

  editActivity(element: joint.shapes.noctua.NodeCellList) {
    const self = this;
    const activity = element.get('activity') as Activity;

    self._activityFormService.initializeForm(activity);
    self.noctuaFormDialogService.openCreateActivityDialog(FormType.ACTIVITY);
  }


  openTable(element: joint.shapes.noctua.NodeCellList) {
    const activity = element.prop('activity') as Activity
    this.selectedElement = element;
    this._activityFormService.onActivityChanged.next(activity);
    // activity.type = element.get('type');
    this.noctuaCommonMenuService.selectRightPanel(RightPanel.camTable);
    this.noctuaCommonMenuService.closeLeftDrawer();
    this.noctuaCommonMenuService.openRightDrawer();


    activity.expanded = true;
    this._camService.currentMatch.activityDisplayId = activity.displayId;
    const q = `#${activity.displayId}`;

    this.noctuaCommonMenuService.scrollTo(q);
  }

  openConnector(element: joint.shapes.noctua.NodeLink) {
    const self = this;

    self.selectedElement = element;
    const source = element.get('source');
    const target = element.get('target');

    if (!source || !target) return;

    self._activityConnectorService.initializeForm(source.id, target.id);
    self._activityConnectorService.selectPanel(ConnectorPanel.FORM)

    self.noctuaCommonMenuService.selectRightPanel(RightPanel.connectorForm);
    self.noctuaCommonMenuService.closeLeftDrawer();
    self.noctuaCommonMenuService.openRightDrawer();

  }

  autoLayoutGraph() {
    this.camCanvas.autoLayoutGraph(this.camCanvas.canvasGraph);
  }

  save() {
    const self = this;
    const cells: joint.dia.Cell[] = this.camCanvas.canvasGraph.getCells();
    const cams = [];
    const triples = [];

    each(cells, (cell: joint.dia.Cell) => {
      const type = cell.get('type');

      if (type === NodeCellType.link) {
        const subject = cell.get('source');
        const object = cell.get('target');

        triples.push({
          subject: {
            uuid: subject.id,
          },
          predicate: {
            id: cell.get('id'),
          },
          object: {
            uuid: object.id
          }
        });
      } else {
        cams.push({
          uuid: cell.get('id'),
          id: cell.get('id'),
          position: cell.get('position'),
          size: cell.get('size'),
        });
      }
    });

    const cam = {
      cams,
      triples
    };

  }
}
