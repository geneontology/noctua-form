
import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatDrawer } from '@angular/material';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { map, filter, reduce, catchError, retry, tap } from 'rxjs/operators';

import { NoctuaUtils } from '@noctua/utils/noctua-utils';
import { CurieService } from '@noctua.curie/services/curie.service';
import { NoctuaGraphService } from '@noctua.form/services/graph.service';

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


  _jsPlumbInstance

  panel = {
    form: {
      id: 1
    },
    camRow: {
      id: 2
    },
    diagramMenu: {
      id: 3
    }
  }

  selectedLeftPanel;
  selectedRightPanel;

  private leftDrawer: MatDrawer;
  private rightDrawer: MatDrawer;

  constructor() {

    this.selectedLeftPanel = this.panel.form;
    this.selectedRightPanel = this.panel.form;
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
        ["Label", { label: "FOO", id: "label", cssClass: "aLabel" }]
      ],
      Container: "canvas"
    });
  }

  get jsPlumbInstance() {
    const self = this;

    if (!this._jsPlumbInstance) {
      self.initJsPlumbInstance()
    }
    return this._jsPlumbInstance;
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
    this.selectLeftPanel(panel)
    return this.rightDrawer.open();
  }

  public closeRightDrawer() {
    return this.rightDrawer.close();
  }


}
