
import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatDrawer } from '@angular/material';
import { BehaviorSubject, Subject, Observable, Subscriber } from 'rxjs';
import { map, filter, reduce, catchError, retry, tap } from 'rxjs/operators';

import { jsPlumb } from 'jsplumb';

import { NoctuaUtils } from '@noctua/utils/noctua-utils';
import { CurieService } from '@noctua.curie/services/curie.service';
import { NoctuaGraphService } from '@noctua.form/services/graph.service';

import { NoctuaFormGridService } from '@noctua.form/services/form-grid.service';
import { NoctuaAnnotonConnectorService } from '@noctua.form/services/annoton-connector.service';
import { NoctuaFormConfigService } from '@noctua.form/services/config/noctua-form-config.service';
import { SummaryGridService } from '@noctua.form/services/summary-grid.service';

import { Curator } from '@noctua.form/models/curator';
import { Group } from '@noctua.form//models/group';

import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';
declare const require: any;
const each = require('lodash/forEach');

@Injectable({
  providedIn: 'root'
})
export class CamDiagramService {

  onNodesReady: Subject<any>[] = [];
  private _jsPlumbInstance
  private _jsPlumbInstance2
  private _scale = {
    x: 0.4,
    y: 0.5
  }

  panel = {
    camForm: {
      id: 1
    },
    connectorForm: {
      id: 2
    },
    camRow: {
      id: 3
    },
    diagramMenu: {
      id: 4
    }
  }

  selectedLeftPanel;
  selectedRightPanel;

  private leftDrawer: MatDrawer;
  private rightDrawer: MatDrawer;

  constructor(private noctuaAnnotonConnectorService: NoctuaAnnotonConnectorService,
    public noctuaFormGridService: NoctuaFormGridService, ) {

    this.selectedLeftPanel = this.panel.camForm;
    this.selectedRightPanel = this.panel.camForm;
    console.log(this.selectedLeftPanel)

  }

  initJsPlumbInstance() {
    const self = this;

    self._jsPlumbInstance = jsPlumb.getInstance({
      Endpoint: ["Dot", <any>{ radius: 2 }],
      Connector: "StateMachine",
      HoverPaintStyle: { stroke: "#1e8151", strokeWidth: 2 },
      ConnectionOverlays: [
        ["Arrow", {
          location: 1,
          id: "arrow",
          length: 14,
          foldback: 0.8
        }],
        //  ["Label", { label: "FOO", id: "label", cssClass: "aLabel" }]
      ],
      Container: "cam-canvas"
    });

    self._jsPlumbInstance2 = jsPlumb.getInstance({
      Endpoint: ["Dot", <any>{ radius: 2 }],
      Connector: "StateMachine",
      HoverPaintStyle: { stroke: "#000000", strokeWidth: 2 },
      ConnectionOverlays: [
        ["Arrow", {
          location: 1,
          id: "arrow",
          length: 14,
          foldback: 0.8
        }],
        //  ["Label", { label: "FOO", id: "label", cssClass: "aLabel" }]
      ],
      Container: "cam-canvas"
    });

  }

  registeJSPlumbrEvents() {
    const self = this;

    self._jsPlumbInstance.bind("connection", function (c) {
      //  info.connection.getOverlay("label").setLabel(info.connection.id);
      self.openConnectorForm(c.sourceId, c.targetId);
    });

    self._jsPlumbInstance.bind("click", (c) => {
      // self.camDiagramService.jsPlumbInstance.deleteConnection(c);
      self.openConnectorForm(c.sourceId, c.targetId);
      console.log(c)
    });
  }

  get jsPlumbInstance() {
    const self = this;

    return this._jsPlumbInstance;
  }

  get jsPlumbInstance2() {
    const self = this;

    return this._jsPlumbInstance2;
  }

  get scale() {
    return this._scale;
  }

  selectLeftPanel(panel) {
    this.selectedLeftPanel = panel;
  }

  selectRightPanel(panel) {
    this.selectedRightPanel = panel;
  }

  public setLeftDrawer(leftDrawer: MatDrawer) {
    this.leftDrawer = leftDrawer;
  }

  public openLeftDrawer() {
    return this.leftDrawer.open();
  }

  public closeLeftDrawer() {
    return this.leftDrawer.close();
  }

  public toggleLeftDrawer(panel) {
    if (this.selectedLeftPanel.id === panel.id) {
      this.leftDrawer.toggle();
    } else {
      this.selectLeftPanel(panel)
      return this.openLeftDrawer();
    }
  }

  public setRightDrawer(rightDrawer: MatDrawer) {
    this.rightDrawer = rightDrawer;
  }

  public openRightDrawer(panel) {
    this.selectRightPanel(panel)
    return this.rightDrawer.open();
  }

  public closeRightDrawer() {
    return this.rightDrawer.close();
  }

  openCamForm() {
    const self = this;

    self.noctuaFormGridService.initalizeForm();
    self.openRightDrawer(self.panel.camForm)
  }

  openConnectorForm(sourceId, targetId) {
    const self = this;

    self.noctuaAnnotonConnectorService.createConnection(sourceId, targetId);
    self.openRightDrawer(self.panel.connectorForm);
  }

  getCausalEffect(sourceId, targetId) {
    const self = this;

    //  self.noctuaAnnotonConnectorService.getCausalEffect(sourceId, targetId);
  }

}
