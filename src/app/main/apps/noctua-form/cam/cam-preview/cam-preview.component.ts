
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { noctuaAnimations } from './../../../../../../@noctua/animations';
import {
  NoctuaFormConfigService,
  NoctuaActivityFormService,
  CamService,
  Cam
} from '@geneontology/noctua-form-base';

@Component({
  selector: 'noc-cam-preview',
  templateUrl: './cam-preview.component.html',
  styleUrls: ['./cam-preview.component.scss'],
  animations: noctuaAnimations
})
export class CamPreviewComponent implements OnInit, OnDestroy {

  searchCriteria: any = {};
  searchFormData: any = [];
  searchForm: FormGroup;

  @Input('cam')
  public cam: Cam;

  modelId: string = '';

  private unsubscribeAll: Subject<any>;

  constructor(public camService: CamService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaActivityFormService: NoctuaActivityFormService,
  ) {

    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }
}
