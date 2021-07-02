import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { noctuaAnimations } from './../../../../../../../@noctua/animations';

import {
  NoctuaFormConfigService,
  NoctuaTripleFormService,
  CamService,
  NoctuaFormMenuService
} from 'noctua-form-base';

import {
  Cam
} from 'noctua-form-base';

@Component({
  selector: 'noc-triple-table',
  templateUrl: './triple-table.component.html',
  styleUrls: ['./triple-table.component.scss'],
  animations: noctuaAnimations
})
export class TripleTableComponent implements OnInit, OnDestroy {

  @Input('cam')
  public cam: Cam

  private unsubscribeAll: Subject<any>;

  constructor(private camService: CamService,
    public noctuaFormMenuService: NoctuaFormMenuService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    //  public noctuaFormMenuService: NoctuaFormMenuService,
    public noctuaTripleFormService: NoctuaTripleFormService) {

    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.loadCam();
  }

  loadCam() {
  }

  selectTriple(triple) {
    this.camService.onCamChanged.next(this.cam);

    this.noctuaTripleFormService.initializeForm(triple);
    //this.noctuaFormMenuService.openRightDrawer(this.noctuaFormMenuService.panel.tripleForm);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}

