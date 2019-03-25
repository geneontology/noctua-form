import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatDrawer } from '@angular/material';

import * as _ from 'lodash';
declare const require: any;
const each = require('lodash/forEach');

@Injectable({
  providedIn: 'root'
})
export class NoctuaFormService {

  panel = {
    camForm: {
      id: 1
    }, annotonForm: {
      id: 2
    }, annotonEntityForm: {
      id: 3
    }, camDiagram: {
      id: 4
    }, camTable: {
      id: 5
    }, connectorForm: {
      id: 6
    },
  }

  selectedLeftPanel;
  selectedMiddlePanel;
  selectedRightPanel;

  private leftDrawer: MatDrawer;
  private rightDrawer: MatDrawer;

  constructor() {
    this.selectedLeftPanel = this.panel.annotonForm;
    this.selectedMiddlePanel = this.panel.camTable;
    this.selectedRightPanel = this.panel.annotonForm;
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
    this.selectRightPanel(panel)
    return this.rightDrawer.open();
  }

  public closeRightDrawer() {
    return this.rightDrawer.close();
  }
}
