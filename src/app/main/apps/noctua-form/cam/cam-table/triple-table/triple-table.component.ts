import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { noctuaAnimations } from './../../../../../../../@noctua/animations';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { NoctuaFormService } from './../../../services/noctua-form.service';
import { CamTableService } from './../services/cam-table.service';

import {
  NoctuaFormConfigService,
  NoctuaTripleFormService,
  CamService
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
    public noctuaFormService: NoctuaFormService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    //  public noctuaFormService: NoctuaFormService,
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
    this.noctuaFormService.openRightDrawer(this.noctuaFormService.panel.tripleForm);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}

