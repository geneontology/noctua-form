
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';

import { noctuaAnimations } from './../../../../../../../../@noctua/animations';




import { CamTableService } from './../../services/cam-table.service';

import {
  NoctuaFormConfigService,
  NoctuaAnnotonEntityService,
  CamService,
  Evidence,
  NoctuaFormMenuService
} from 'noctua-form-base';

import {
  Cam,
  Annoton,
  AnnotonNode
} from 'noctua-form-base';


@Component({
  selector: 'noc-evidence-table',
  templateUrl: './evidence-table.component.html',
  styleUrls: ['./evidence-table.component.scss'],
  animations: noctuaAnimations
})
export class EvidenceTableComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'evidence',
    'reference',
    'with',
    'assignedBy'];

  grid: any[] = [];

  qualifier;

  @Input('cam')
  public cam: Cam;

  @Input('evidence')
  public evidence: Evidence[];

  private unsubscribeAll: Subject<any>;

  constructor(private camService: CamService,
    public noctuaFormMenuService: NoctuaFormMenuService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    //  public noctuaFormMenuService: NoctuaFormMenuService,
    public camTableService: CamTableService,
    public noctuaAnnotonEntityService: NoctuaAnnotonEntityService) {

    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    console.log(this.evidence)

    if (this.evidence.length > 0) {
      this.qualifier = this.evidence[0].edge
    }
  }

  selectEntity(annoton: Annoton, entity: AnnotonNode) {
    this.camService.onCamChanged.next(this.cam);

    this.noctuaAnnotonEntityService.initializeForm(annoton, entity);
    this.noctuaFormMenuService.openRightDrawer(this.noctuaFormMenuService.panel.annotonEntityForm);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}

