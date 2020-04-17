import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { noctuaAnimations } from './../../../../../../../@noctua/animations';
import { CamTableService } from './../services/cam-table.service';

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
  displayedColumns = [
    'subject',
    'aspectS',
    'relationship',
    'object',
    'aspectO',
    'evidence',
    'reference',
    'with',
    'assignedBy'];

  grid: any[] = [];

  @Input('cam')
  public cam: Cam

  private unsubscribeAll: Subject<any>;

  constructor(private camService: CamService,
    public noctuaFormMenuService: NoctuaFormMenuService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    //  public noctuaFormMenuService: NoctuaFormMenuService,
    public camTableService: CamTableService,
    public noctuaTripleFormService: NoctuaTripleFormService) {

    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.loadCam();
  }

  loadCam() {
    this.grid = this.cam.generateTripleGrid();
  }

  selectTriple(triple) {
    console.log(this.grid);
    this.camService.onCamChanged.next(this.cam);

    this.noctuaTripleFormService.initializeForm(triple);
    this.noctuaFormMenuService.openRightDrawer(this.noctuaFormMenuService.panel.tripleForm);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}

