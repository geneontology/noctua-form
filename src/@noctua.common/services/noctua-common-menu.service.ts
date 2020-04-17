import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { MatSidenav } from '@angular/material/sidenav';
import { NoctuaGraphService } from 'noctua-form-base';



@Injectable({
  providedIn: 'root'
})
export class NoctuaCommonMenuService {
  private _leftSidenav: MatSidenav;

  constructor(private _noctuaGraphService: NoctuaGraphService) {

  }

  createModel(type: 'graph-editor' | 'noctua-form') {
    const self = this;

    const _newModelBbopManager = this._noctuaGraphService.registerManager();
    _newModelBbopManager.register('rebuild', function (resp) { }, 10);
    _newModelBbopManager.add_model().then((resp) => {
      const modelId = resp.data().id;
      let params = new HttpParams();
      params = params.append('model_id', modelId);
      params = params.append('barista_token', _newModelBbopManager.user_token());
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


}
