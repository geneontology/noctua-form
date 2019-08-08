
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort } from '@angular/material';
import { Subject } from 'rxjs';

import { noctuaAnimations } from './../../../../../../../../@noctua/animations';

import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";

import { NoctuaFormService } from './../../../../services/noctua-form.service';
import { CamTableService } from './../../services/cam-table.service';

import {
  NoctuaFormConfigService,
  NoctuaAnnotonEntityService,
  CamService,
  Evidence
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
    public noctuaFormService: NoctuaFormService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    //  public noctuaFormService: NoctuaFormService,
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
    this.noctuaFormService.openRightDrawer(this.noctuaFormService.panel.annotonEntityForm);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}

