
import { environment } from './../../../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatDrawer } from '@angular/material/sidenav';
import { BehaviorSubject, Subject, Observable, Subscriber } from 'rxjs';
import { map, filter, reduce, catchError, retry, tap } from 'rxjs/operators';

import { jsPlumb } from 'jsplumb';

import { CurieService } from './../../../../../../../@noctua.curie/services/curie.service';
import { NoctuaGraphService, NoctuaFormMenuService } from 'noctua-form-base';


import { NoctuaAnnotonFormService } from 'noctua-form-base';
import { NoctuaAnnotonConnectorService } from 'noctua-form-base';
import { NoctuaFormConfigService } from 'noctua-form-base';


import { Contributor } from 'noctua-form-base';
import { Group } from 'noctua-form-base';


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

  constructor(
    private noctuaAnnotonConnectorService: NoctuaAnnotonConnectorService,
    public noctuaAnnotonFormService: NoctuaAnnotonFormService,
    public noctuaFormMenuService: NoctuaFormMenuService) {
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

  openAnnotonForm() {
    const self = this;

    self.noctuaAnnotonFormService.initializeForm();
    self.noctuaFormMenuService.openRightDrawer(self.noctuaFormMenuService.panel.annotonForm)
  }

  openConnectorForm(sourceId, targetId) {
    const self = this;

    self.noctuaAnnotonConnectorService.initializeForm(sourceId, targetId);
    self.noctuaFormMenuService.openRightDrawer(self.noctuaFormMenuService.panel.connectorForm);
  }

  getCausalEffect(sourceId, targetId) {
    const self = this;

    //  self.noctuaAnnotonConnectorService.getCausalEffect(sourceId, targetId);
  }

}
