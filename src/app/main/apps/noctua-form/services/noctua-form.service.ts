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


import { Curator } from '@noctua.form/models/curator';
import { Group } from '@noctua.form//models/group';

import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';
declare const require: any;
const each = require('lodash/forEach');

@Injectable({
  providedIn: 'root'
})
export class NoctuaFormService {

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
    camDiagram: {
      id: 4
    },
    camTable: {
      id: 5
    }
  }

  selectedLeftPanel;
  selectedMiddlePanel;
  selectedRightPanel;

  private leftDrawer: MatDrawer;
  private rightDrawer: MatDrawer;

  constructor() {

    this.selectedLeftPanel = this.panel.camForm;
    this.selectedMiddlePanel = this.panel.camDiagram;
    this.selectedRightPanel = this.panel.camForm;
    console.log(this.selectedLeftPanel)

  }

  selectLeftPanel(panel) {
    this.selectedLeftPanel = panel;
  }

  selectMiddlePanel(panel) {
    this.selectedMiddlePanel = panel;
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

  public openMiddlePanel(panel) {
    this.selectMiddlePanel(panel)
  }

  public openRightDrawer(panel) {
    this.selectLeftPanel(panel)
    return this.rightDrawer.open();
  }

  public closeRightDrawer() {
    return this.rightDrawer.close();
  }
}
