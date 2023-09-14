import { Injectable } from '@angular/core';
import 'jqueryui';
import * as joint from 'jointjs';
import { each } from 'lodash';
import { NoctuaCommonMenuService } from '@noctua.common/services/noctua-common-menu.service';
import { NoctuaDataService } from '@noctua.common/services/noctua-data.service';
import { Activity, Cam, CamService, FormType, NoctuaActivityConnectorService, NoctuaActivityFormService, noctuaFormConfig, NoctuaFormConfigService, BbopGraphService, NoctuaUserService } from '@geneontology/noctua-form-base';
import { NodeLink, NodeCellList, NoctuaShapesService } from '@noctua.graph/services/shapes.service';
import { NodeType } from 'scard-graph-ts';
import { NodeCellType } from '@noctua.graph/models/shapes';
import { noctuaStencil, StencilItemNode } from '@noctua.graph/data/cam-stencil';
import { RightPanel } from '@noctua.common/models/menu-panels';
import { NoctuaConfirmDialogService } from '@noctua/components/confirm-dialog/confirm-dialog.service';
import { CamCanvas } from '@noctua.graph/models/cam-canvas';
import { CamStencil } from '@noctua.graph/models/cam-stencil';
import { NoctuaGraphEditorService } from '@noctua.graph/services/graph-editor-service';
import { NoctuaFormDialogService } from 'app/main/apps/noctua-form/services/dialog.service';

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
    private noctuaGraphEditorService: NoctuaGraphEditorService,
    private _bbopGraphService: BbopGraphService,
    private _noctuaFormDialogService: NoctuaFormDialogService,
    private _noctuaUserService: NoctuaUserService,
    private confirmDialogService: NoctuaConfirmDialogService,
    private _activityFormService: NoctuaActivityFormService,
    private _activityConnectorService: NoctuaActivityConnectorService,
    public noctuaCommonMenuService: NoctuaCommonMenuService,
    private noctuaShapesService: NoctuaShapesService) {


    /*    this._camService.onCamChanged
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
         }); */
  }

  initializeGraph() {
    const self = this;

    self.camCanvas = new CamCanvas();
    self.camCanvas.elementOnClick = self.openTable.bind(self);
    self.camCanvas.editOnClick = self.openTable.bind(self);
    self.camCanvas.deleteOnClick = self.deleteActivity.bind(self);
    self.camCanvas.linkOnClick = self.openConnector.bind(self);
    self.camCanvas.onLinkCreated = self.createActivityConnector.bind(self);
    self.camCanvas.onUpdateCamLocations = self.updateCamLocations.bind(self);

  }

  initializeStencils() {
    const self = this;

    self.camStencil = new CamStencil(self.camCanvas, noctuaStencil.camStencil);
    self.camStencil.onAddElement = self.createActivity.bind(self);
  }

  addToCanvas(cam: Cam, graphLayoutDetail: string) {
    this.cam = cam;
    this.camCanvas.addCanvasGraph(cam, graphLayoutDetail);
  }

  zoom(delta: number, e?) {
    this.camCanvas.zoom(delta, e);
  }

  reset() {
    this.camCanvas.resetZoom();
  }

  updateCamLocations(cam: Cam) {
    this._bbopGraphService.setActivityLocations(cam);
  }

  createActivity(element: joint.shapes.noctua.NodeCellList, x: number, y: number) {
    const self = this;
    const node = element.get('node') as StencilItemNode;

    self.placeholderElement.position(x, y);
    self._activityFormService.setActivityType(node.type)
    self._activityFormService.activity.validateEvidence = false;
    self._noctuaFormDialogService.openCreateActivityDialog(FormType.ACTIVITY);
  }

  createActivityConnector(
    sourceId: string,
    targetId: string,
    link: joint.shapes.noctua.NodeLink) {
    const self = this;

    self._activityConnectorService.initializeForm(sourceId, targetId);
    self._noctuaFormDialogService.openCreateActivityDialog(FormType.ACTIVITY_CONNECTOR);
  }

  addActivity(activity: Activity, graphLayoutDetail: string) {
    const self = this;
    const position = self.placeholderElement.prop('position') as joint.dia.Point

    activity.position.x = position.x
    activity.position.y = position.y

    const el = self.camCanvas.createNode(activity, graphLayoutDetail)

    self.camCanvas.canvasGraph.addCell(el);

    this._bbopGraphService.addActivityLocation(self.cam, activity);
  }

  deleteActivity(element: joint.shapes.noctua.NodeCellList) {
    const self = this;

    const activity = element.get('activity') as Activity;

    const success = () => {
      this._camService.deleteActivity(activity).then(() => {
        this._camService.onSelectedActivityChanged.next(null);
        this.noctuaCommonMenuService.closeRightDrawer();
        this._camService.getCam(this.cam.id);
        self._noctuaFormDialogService.openInfoToast('Activity successfully deleted.', 'OK');
      });
    };

    if (!self._noctuaUserService.user) {
      this.confirmDialogService.openConfirmDialog('Not Logged In',
        'Please log in to continue.',
        null);
    } else {
      this.confirmDialogService.openConfirmDialog('Confirm Delete?',
        'You are about to delete an activity.',
        success);
    }
  }


  openTable(element: joint.shapes.noctua.NodeCellList) {
    const activity = element.prop('activity') as Activity
    this.selectedElement = element;
    this._camService.onSelectedActivityChanged.next(activity);
    // activity.type = element.get('type');
    this.noctuaCommonMenuService.selectRightPanel(RightPanel.activityTable);
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
    self.noctuaCommonMenuService.selectRightPanel(RightPanel.activityConnectorTable);
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
