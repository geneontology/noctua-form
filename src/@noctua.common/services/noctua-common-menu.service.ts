import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { NoctuaGraphService, NoctuaUserService } from 'noctua-form-base';
import { LeftPanel, MiddlePanel, RightPanel } from './../models/menu-panels';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { BehaviorSubject } from 'rxjs';
import { SettingsOptions } from './../models/graph-settings';

@Injectable({
  providedIn: 'root'
})
export class NoctuaCommonMenuService {

  onCamSettingsChanged: BehaviorSubject<SettingsOptions>;
  selectedLeftPanel: LeftPanel;
  selectedMiddlePanel: MiddlePanel;
  selectedRightPanel: RightPanel;
  resultsViewScrollbar: PerfectScrollbarDirective;

  private _leftDrawer: MatDrawer;
  private _rightDrawer: MatDrawer;
  private _leftSidenav: MatSidenav;

  constructor(
    private _noctuaGraphService: NoctuaGraphService,
    private noctuaUserService: NoctuaUserService) {

    const settings = new SettingsOptions()
    settings.graphSettings()
    this.onCamSettingsChanged = new BehaviorSubject(settings);
  }

  createModel(type: 'graph-editor' | 'noctua-form') {
    const self = this;

    const _newModelBbopManager = this._noctuaGraphService.registerManager();
    _newModelBbopManager.register('rebuild', function (resp) { }, 10);
    _newModelBbopManager.add_model().then((resp) => {
      const modelId = resp.data().id;
      let params = new HttpParams();
      params = params.append('model_id', modelId);
      params = params.append('barista_token', self.noctuaUserService.baristaToken);
      const paramsString = params.toString();

      const graphEditorUrl = environment.noctuaUrl + '/editor/graph/' + modelId + '?' + paramsString;
      const noctuaFormUrl = environment.workbenchUrl + 'noctua-form?' + paramsString;

      if (type === 'graph-editor') {
        window.open(graphEditorUrl, '_blank');
      } else if (type === 'noctua-form') {
        window.open(noctuaFormUrl, '_blank');
      }
    });
  }

  public setLeftSidenav(leftSidenav: MatSidenav) {
    this._leftSidenav = leftSidenav;
  }

  public openLeftSidenav() {
    return this._leftSidenav.open();
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
    this._leftDrawer = leftDrawer;
  }

  public closeLeftDrawer() {
    return this._leftDrawer.close();
  }

  public setRightDrawer(rightDrawer: MatDrawer) {
    this._rightDrawer = rightDrawer;
  }

  public openLeftDrawer() {
    return this._leftDrawer.open();
  }

  public openRightDrawer() {
    return this._rightDrawer.open();
  }

  public closeRightDrawer() {
    return this._rightDrawer.close();
  }

  public toggleLeftDrawer(panel: LeftPanel) {
    if (this.selectedLeftPanel === panel) {
      this._leftDrawer.toggle();
    } else {
      this.selectLeftPanel(panel);
      return this.openLeftDrawer();
    }
  }

  scrollTo(q: string) {

    setTimeout(() => {
      if (this.resultsViewScrollbar) {
        this.resultsViewScrollbar.update();

        setTimeout(() => {
          this.resultsViewScrollbar.scrollToElement(q, -140, 1000);
        });
      }
    });
  }

}
