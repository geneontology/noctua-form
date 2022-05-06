import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NoctuaFormConfigService } from '@geneontology/noctua-form-base';

@Injectable({
  providedIn: 'root'
})
export class NoctuaGraphEditorService {
  selectedGraphLayoutDetail
  onGraphLayoutDetailChanged: BehaviorSubject<any>;
  constructor(
    private noctuaFormConfigService: NoctuaFormConfigService) {
    this.selectedGraphLayoutDetail = this.noctuaFormConfigService.graphLayoutDetail.selected;
    this.onGraphLayoutDetailChanged = new BehaviorSubject(null);
  }

}
