import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { LeftPanel, MiddlePanel, RightPanel } from './../models/menu-panels';

@Injectable({
  providedIn: 'root'
})
export class NoctuaFormMenuService {
  selectedLeftPanel: LeftPanel;
  selectedMiddlePanel: MiddlePanel;
  selectedRightPanel: RightPanel;

  private leftDrawer: MatDrawer;
  private rightDrawer: MatDrawer;

  constructor() {
    this.selectedMiddlePanel = MiddlePanel.camTable;
  }

  selectLeftPanel(panel: LeftPanel) {
    this.selectedLeftPanel = panel;
  }

  selectMiddlePanel(panel: MiddlePanel) {
    this.selectedMiddlePanel = panel;
  }

  selectRightPanel(panel: RightPanel) {
    this.selectedRightPanel = panel;
  }


  public setLeftDrawer(leftDrawer: MatDrawer) {
    this.leftDrawer = leftDrawer;
  }

  public openLeftDrawer(panel: LeftPanel) {
    this.selectLeftPanel(panel)
    return this.leftDrawer.open();
  }

  public closeLeftDrawer() {
    return this.leftDrawer.close();
  }

  public toggleLeftDrawer(panel: LeftPanel) {
    if (this.selectedLeftPanel === panel) {
      this.leftDrawer.toggle();
    } else {
      return this.openLeftDrawer(panel);
    }
  }

  public setRightDrawer(rightDrawer: MatDrawer) {
    this.rightDrawer = rightDrawer;
  }

  public openRightDrawer(panel: RightPanel) {
    this.selectRightPanel(panel)
    return this.rightDrawer.open();
  }

  public closeRightDrawer() {
    return this.rightDrawer.close();
  }


}
